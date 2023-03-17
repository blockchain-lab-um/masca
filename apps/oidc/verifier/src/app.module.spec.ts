// import { Test, TestingModule } from '@nestjs/testing';

import { HttpServer } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { FastifyInstance } from 'fastify';
import * as qs from 'qs';
import request from 'supertest';

import {
  TEST_USER_PRIVATE_KEY,
  TEST_VERIFIER_URL,
} from '../tests/constants.js';
import getAgent from '../tests/testAgent.js';
import { createJWTProof, importDid } from '../tests/utils.js';
import { AppModule } from './app.module.js';

describe('Verifier controler', () => {
  let app: NestFastifyApplication;
  let server: HttpServer;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter()
    );

    // configService = app.get<ConfigService<IConfig, true>>(ConfigService);

    await app.init();
    await (app.getHttpAdapter().getInstance() as FastifyInstance).ready();
    server = app.getHttpServer() as HttpServer;
  });

  describe('[GET]: /authorization-request', () => {
    it('Should succeed without query', async () => {
      const response = await request(server)
        .get('/authorization-request')
        .query({
          credentialType: 'test-123',
          state: 'state-123',
        })
        .send();

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe(
        'text/plain; charset=utf-8'
      );

      const query = qs.parse(response.text.replace('openid://?', ''));

      expect(query).toStrictEqual({
        response_type: 'vp_token id_token',
        client_id: expect.any(String),
        redirect_uri: expect.any(String),
        scope: 'openid',
        id_token_type: 'subject_signed',
        nonce: expect.any(String),
        presentation_definition: '{}',
        state: 'state-123',
      });

      expect.assertions(3);
    });
  });

  describe('[POST]: /authorization-response', () => {
    it('Should succed', async () => {
      let response = await request(server)
        .get('/authorization-request')
        .query({
          credentialType: 'test-123',
          state: 'state-123',
        })
        .send();

      expect(response.status).toBe(200);

      // TODO: Use the query
      const query = qs.parse(response.text.replace('openid://?', ''));

      const agent = await getAgent();

      // Import the did of the test user
      const identifier = await importDid(
        agent,
        TEST_USER_PRIVATE_KEY,
        'testuser'
      );

      const jwtVc =
        'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVW5pdmVyc2l0eURlZ3JlZUNyZWRlbnRpYWwiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huLmRvZUBnbWFpbC5jb20ifX0sInN1YiI6ImRpZDpldGhyOjB4MDNmZDRmYWMyNWY0N2JlNWNmZjA2NjkyZjQzNjdmZWRkYWU5NjI2NDdjYmY5MzRhOTIzZDA1MTczYmRkYzQyZjVkIiwibmJmIjoxNjcxNzk3MTU0LCJpc3MiOiJkaWQ6ZXRocjoweDAyODBhOWNkNDhmZDQzNmY4YzFmODFiMTU2ZWI2MTU2MThjZDU3M2MzZWIxZTZkOTM3YTE3YjgyMjIwMjdjYWU4NSJ9.rc8UN6Ikx85xsqtzL6BK9pHkr8nOVrOWGVUb-djTorVCiciLyBR9VhEUteKZHQ0vHKIqJwvPtSzG1-NjWpnmXw';

      // TODO: Handle presentation_submission correctly
      const presentationSubmission = 'TODO';

      // Create VP
      const vp = await agent.createVerifiablePresentation({
        presentation: {
          holder: identifier.did,
          verifiableCredential: [jwtVc],
        },
        proofFormat: 'jwt',
      });

      // Create VP Token
      // TODO: Split this into a separate function (createVpToken)
      const vpToken = await createJWTProof({
        privateKey: TEST_USER_PRIVATE_KEY,
        audience: TEST_VERIFIER_URL,
        data: { vp, nonce: query.nonce },
      });

      // TODO: Split this into a separate function (createIdToken)
      const idToken = await createJWTProof({
        privateKey: TEST_USER_PRIVATE_KEY,
        audience: TEST_VERIFIER_URL,
        data: {
          sub: identifier.did,
          nonce: query.nonce,
        },
      });

      response = await request(server)
        .post('/authorization-response')
        .type('form')
        .send(
          qs.stringify({
            state: query.state,
            id_token: idToken,
            vp_token: vpToken,
            presentation_submission: presentationSubmission,
          })
        );

      expect(response.status).toBe(200);
    });
  });
});
