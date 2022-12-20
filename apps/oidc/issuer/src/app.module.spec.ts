import { HttpServer } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { FastifyInstance } from 'fastify';
import request from 'supertest';
import * as qs from 'qs';
import {
  CredentialRequest,
  TokenRequest,
  TokenResponse,
} from '@blockchain-lab-um/oidc-types';
import { ISSUER_URL, USER_PRIVATE_KEY } from '../tests/constants';
import { createJWTProof } from '../tests/utils';
import { AppModule } from './app.module';
import { AgentService } from './modules/agent/agent.service';
// import { IConfig } from './config/configuration';

describe('Issuer controler', () => {
  let app: NestFastifyApplication;
  let server: HttpServer;
  // let configService: ConfigService<IConfig, true>;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter()
    );

    // configService = app.get<ConfigService<IConfig, true>>(ConfigService);
    await app.get<AgentService>(AgentService).initializeAgent();

    await app.init();
    await (app.getHttpAdapter().getInstance() as FastifyInstance).ready();
    server = app.getHttpServer() as HttpServer;
  });

  describe('[GET]: /metadata', () => {
    it('todo', () => {});
  });

  describe('[GET]: /initiation-request', () => {
    describe('Should succeed', () => {
      it('Should succeed without query', async () => {
        const response = await request(server)
          .get('/initiation-request')
          .send();

        expect(response.status).toBe(200);

        // TODO: Check response text
        expect.assertions(1);
      });
    });

    describe('Should fail', () => {});
  });

  describe('[POST]: /token', () => {
    describe('Should succeed', () => {
      it('With pre-authorized_code', async () => {
        let response = await request(server).get('/initiation-request').send();

        const query = qs.parse(
          response.text.replace(
            'openid_initiate_issuance://credential_offer?',
            ''
          )
        );

        expect(response.status).toBe(200);

        const tokenRequestData: TokenRequest = {
          grant_type: 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
          'pre-authorized_code': query['pre-authorized_code'] as string,
        };

        response = await request(server).post('/token').send(tokenRequestData);

        expect(response.status).toBe(200);

        expect.assertions(2);
      });

      it('TODO With authorization_code', async () => {});

      it('TODO With pre-authorization_code and user_pin', async () => {});
    });

    describe('TODO Should fail', () => {
      it('With invalid pre-authorized_code', async () => {});
    });
  });

  describe('[POST]: /credential', () => {
    describe('Should succeed', () => {
      it('With valid authorization header and valid credential request', async () => {
        let response = await request(server).get('/initiation-request').send();

        const query = qs.parse(
          response.text.replace(
            'openid_initiate_issuance://credential_offer?',
            ''
          )
        );

        expect(response.status).toBe(200);

        const tokenRequestData: TokenRequest = {
          grant_type: 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
          'pre-authorized_code': query['pre-authorized_code'] as string,
        };

        response = await request(server).post('/token').send(tokenRequestData);

        expect(response.status).toBe(200);

        const {
          access_token: accessToken,
          token_type: tokenType,
          expires_in: expiresIn,
          c_nonce: cNonce,
          c_nonce_expires_in: cNonceExpiresIn,
        } = response.body as TokenResponse;

        expect(accessToken).toBeDefined();
        expect(tokenType).toBeDefined();
        expect(expiresIn).toBeDefined();
        expect(cNonce).toBeDefined();
        expect(cNonceExpiresIn).toBeDefined();

        const credentialRequest: CredentialRequest = {
          format: 'jwt_vc_json',
          types: ['VerifiableCredential', 'UniversityDegreeCredential'],
          proof: {
            proof_type: 'jwt',
            jwt: await createJWTProof(USER_PRIVATE_KEY, ISSUER_URL, cNonce),
          },
        };

        response = await request(server)
          .post('/credential')
          .auth(accessToken, { type: 'bearer' })
          .send(credentialRequest);

        expect(response.status).toBe(200);
        console.log(response.body);
      });
    });

    describe('TODO Should fail', () => {
      it('With invalid authorization header', () => {});
      it('With invalid credential request', () => {});
    });
  });
});
