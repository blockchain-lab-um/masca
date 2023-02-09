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
import getAgent from '../tests/testAgent';
import { TEST_ISSUER_URL, TEST_USER_PRIVATE_KEY } from '../tests/constants';
import { createJWTProof } from '../tests/utils';
import { AppModule } from './app.module';
import { AgentService } from './modules/agent/agent.service';
import { TEST_METADATA } from './tests/constants';
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

  afterAll(async () => {
    app.enableShutdownHooks();
    await server.close();

    await app.close();
  });

  describe('[GET]: /.well-known/openid-credential-issuer', () => {
    it('Should succeed getting issuer metadata', async () => {
      const response = await request(server)
        .get('/.well-known/openid-credential-issuer')
        .send();

      expect(response.status).toBe(200);
      expect(response.header['content-type']).toContain('application/json');
      // TODO: Update later
      expect(response.body).toEqual(TEST_METADATA);
      expect.assertions(3);
    });
  });

  describe('[GET]: /credential-offer', () => {
    describe('Should succeed', () => {
      it('Should succeed with valid query', async () => {
        const response = await request(server)
          .get('/credential-offer')
          .query({
            schema:
              'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
            grants: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
            userPinRequired: true,
          })
          .send();
        expect(response.status).toBe(200);

        const query = qs.parse(
          response.text.replace(
            'openid_credential_offer://credential_offer?',
            ''
          )
        ) as any;
        expect(query.credential_issuer).toBeDefined();
        expect(query.credentials).toStrictEqual([
          'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
        ]);

        expect.assertions(3);
      });
    });

    describe('Should fail', () => {});
  });

  describe('[POST]: /token', () => {
    describe('Should succeed', () => {
      it('With pre-authorized_code', async () => {
        let response = await request(server)
          .get('/credential-offer')
          .query({
            schema:
              'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
            grants: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
          })
          .send();

        const query = qs.parse(
          response.text.replace(
            'openid_credential_offer://credential_offer?',
            ''
          )
        ) as any;

        expect(response.status).toBe(200);

        const tokenRequestData: TokenRequest = {
          grant_type: 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
          'pre-authorized_code': query.grants[
            'urn:ietf:params:oauth:grant-type:pre-authorized_code'
          ]['pre-authorized_code'] as string,
        };

        response = await request(server)
          .post('/token')
          .type('form')
          .send(tokenRequestData);

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
        let response = await request(server)
          .get('/credential-offer')
          .query({
            schema:
              'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
            grants: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
          })
          .send();

        const query = qs.parse(
          response.text.replace(
            'openid_credential_offer://credential_offer?',
            ''
          )
        ) as any;

        expect(response.status).toBe(200);

        const tokenRequestData: TokenRequest = {
          grant_type: 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
          'pre-authorized_code': query.grants[
            'urn:ietf:params:oauth:grant-type:pre-authorized_code'
          ]['pre-authorized_code'] as string,
        };

        response = await request(server)
          .post('/token')
          .type('form')
          .send(tokenRequestData);

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
            jwt: await createJWTProof({
              privateKey: TEST_USER_PRIVATE_KEY,
              audience: TEST_ISSUER_URL,
            }),
          },
        };

        response = await request(server)
          .post('/credential')
          .auth(accessToken, { type: 'bearer' })
          .send(credentialRequest);

        expect(response.status).toBe(200);
        expect(response.body.format).toBe('jwt_vc_json');
        expect(response.body.credential).toBeDefined();

        console.log(JSON.stringify(response.body.credential));

        // Verify credential
        const agent = await getAgent();
        const res = await agent.verifyCredential({
          credential: response.body.credential,
        });
        expect(res.verified).toBeTruthy();

        expect.assertions(11);
      });
    });

    describe('TODO Should fail', () => {
      it('With invalid authorization header', () => {});
      it('With invalid credential request', () => {});
    });
  });
});
