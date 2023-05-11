import {
  CredentialOfferRequest,
  CredentialRequest,
  SupportedCredential,
  TOKEN_ERRORS,
  TokenRequest,
  TokenResponse,
} from '@blockchain-lab-um/oidc-types';
import { HttpServer } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { FastifyInstance } from 'fastify';
import qs from 'qs';
import request from 'supertest';

import {
  TEST_ISSUER_URL,
  TEST_METADATA,
  TEST_USER_PRIVATE_KEY,
} from '../tests/constants.js';
import getAgent from '../tests/testAgent.js';
import { createJWTProof } from '../tests/utils.js';
import { AppModule } from './app.module.js';
import AllExceptionsFilter from './filters/all-exceptions.filter.js';
import { AgentService } from './modules/agent/agent.service.js';

const credOfferAndTokenRequest = async (server: HttpServer<any, any>) => {
  const credentialRequestData: CredentialOfferRequest = {
    credentials: ['GmCredential'],
    grants: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
  };

  let response = await request(server)
    .get('/credential-offer')
    .query(credentialRequestData)
    .send();

  const query = JSON.parse(
    decodeURIComponent(
      response.text.replace('openid_credential_offer://credential_offer?', '')
    )
  );

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

  expect(response.body).toStrictEqual({
    access_token: expect.any(String),
    expires_in: expect.any(Number),
    c_nonce: expect.any(String),
    c_nonce_expires_in: expect.any(Number),
    token_type: 'Bearer',
  });

  const { access_token: accessToken, c_nonce: cNonce } =
    response.body as TokenResponse;

  // Get credential issuer metadata and select the correct format for the test schema
  response = await request(server)
    .get('/.well-known/openid-credential-issuer')
    .send();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const supportedCredential = response.body.credentials_supported.find(
    (credential: any) => credential.id === query.credentials[0]
  ) as SupportedCredential;

  if (!supportedCredential) {
    throw new Error('No supported credential found');
  }

  return {
    accessToken,
    cNonce,
    supportedCredential,
  };
};

describe('Issuer controller', () => {
  let app: NestFastifyApplication;
  let server: HttpServer;
  // let configService: ConfigService<IConfig, true>;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const fastifyAdapter = new FastifyAdapter();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, global-require, @typescript-eslint/no-var-requires
    await fastifyAdapter.register(require('@fastify/formbody'), {
      parser: (str: string) => {
        return qs.parse(str, {
          depth: 50,
          parameterLimit: 1000,
        });
      },
    });

    app = testingModule.createNestApplication<NestFastifyApplication>(
      fastifyAdapter,
      { bodyParser: false }
    );

    app = testingModule.createNestApplication<NestFastifyApplication>(
      fastifyAdapter,
      { bodyParser: false }
    );

    // configService = app.get<ConfigService<IConfig, true>>(ConfigService);
    await app.get<AgentService>(AgentService).initializeAgent();

    app.useGlobalFilters(new AllExceptionsFilter());
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
      expect(response.body).toEqual(TEST_METADATA);
      expect.assertions(3);
    });
  });

  describe('[GET]: /credential-offer', () => {
    /**
     * Success cases
     */
    describe('Should succeed', () => {
      /**
       * Credential offer by credential id
       */
      it('Credential offer by credential id', async () => {
        const credentialOfferRequestData: CredentialOfferRequest = {
          credentials: ['GmCredential'],
          grants: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
        };

        const response = await request(server)
          .get('/credential-offer')
          .query(credentialOfferRequestData)
          .send();

        expect(response.status).toBe(200);

        const query = JSON.parse(
          decodeURIComponent(
            response.text.replace(
              'openid_credential_offer://credential_offer?',
              ''
            )
          )
        );

        expect(query.credentials).toStrictEqual(['GmCredential']);
        expect(query.credential_issuer).toBeDefined();
        expect(query.grants).toStrictEqual({
          'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
            'pre-authorized_code': expect.any(String),
          },
        });

        expect.assertions(4);
      });

      /**
       * Credential offer by jwt_vc_json format
       */
      it('Credential offer by jwt_vc_json format and types array', async () => {
        const credentialOfferRequestData: CredentialOfferRequest = {
          credentials: [
            {
              format: 'jwt_vc_json',
              types: ['VerifiableCredential', 'GmCredential'],
            },
          ],
          grants: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
        };

        const response = await request(server)
          .get('/credential-offer')
          .query(credentialOfferRequestData)
          .send();

        expect(response.status).toBe(200);

        const query = JSON.parse(
          decodeURIComponent(
            response.text.replace(
              'openid_credential_offer://credential_offer?',
              ''
            )
          )
        );

        expect(query.credentials).toStrictEqual([
          {
            format: 'jwt_vc_json',
            types: ['VerifiableCredential', 'GmCredential'],
          },
        ]);
        expect(query.credential_issuer).toBeDefined();
        expect(query.grants).toStrictEqual({
          'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
            'pre-authorized_code': expect.any(String),
          },
        });

        expect.assertions(4);
      });

      /**
       * Credential offer by jwt_vc_json-ld forma
       */
      it('Credential offer by jwt_vc_json-ld format and types array', async () => {
        const credentialOfferRequestData: CredentialOfferRequest = {
          credentials: [
            {
              format: 'jwt_vc_json-ld',
              types: ['VerifiableCredential', 'GmCredential'],
            },
          ],
          grants: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
        };

        const response = await request(server)
          .get('/credential-offer')
          .query(credentialOfferRequestData)
          .send();

        expect(response.status).toBe(200);

        const query = JSON.parse(
          decodeURIComponent(
            response.text.replace(
              'openid_credential_offer://credential_offer?',
              ''
            )
          )
        );

        expect(query.credentials).toStrictEqual([
          {
            format: 'jwt_vc_json-ld',
            types: ['VerifiableCredential', 'GmCredential'],
          },
        ]);
        expect(query.credential_issuer).toBeDefined();
        expect(query.grants).toStrictEqual({
          'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
            'pre-authorized_code': expect.any(String),
          },
        });

        expect.assertions(4);
      });

      /**
       * Credential offer by ldp_vc format
       */
      it('Credential offer by ldp_vc format and types array', async () => {
        const credentialOfferRequestData: CredentialOfferRequest = {
          credentials: [
            {
              format: 'ldp_vc',
              types: ['VerifiableCredential', 'GmCredential'],
            },
          ],
          grants: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
        };

        const response = await request(server)
          .get('/credential-offer')
          .query(credentialOfferRequestData)
          .send();

        expect(response.status).toBe(200);

        const query = JSON.parse(
          decodeURIComponent(
            response.text.replace(
              'openid_credential_offer://credential_offer?',
              ''
            )
          )
        );

        expect(query.credentials).toStrictEqual([
          {
            format: 'ldp_vc',
            types: ['VerifiableCredential', 'GmCredential'],
          },
        ]);
        expect(query.credential_issuer).toBeDefined();
        expect(query.grants).toStrictEqual({
          'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
            'pre-authorized_code': expect.any(String),
          },
        });

        expect.assertions(4);
      });

      /**
       * Credential offer by multiple formats
       */
      it('Credential offer by multiple formats', async () => {
        const credentialOfferRequestData: CredentialOfferRequest = {
          credentials: [
            {
              format: 'jwt_vc_json',
              types: ['VerifiableCredential', 'GmCredential'],
            },
            {
              format: 'jwt_vc_json-ld',
              types: ['VerifiableCredential', 'GmCredential'],
            },
            {
              format: 'ldp_vc',
              types: ['VerifiableCredential', 'GmCredential'],
            },
            {
              format: 'mso_mdoc',
              doctype: 'org.iso.18013.5.1.mDL',
            },
          ],
          grants: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
        };

        const response = await request(server)
          .get('/credential-offer')
          .query(qs.stringify(credentialOfferRequestData))
          .send();

        expect(response.status).toBe(200);

        const query = JSON.parse(
          decodeURIComponent(
            response.text.replace(
              'openid_credential_offer://credential_offer?',
              ''
            )
          )
        );

        expect(query.credentials).toStrictEqual([
          {
            format: 'jwt_vc_json',
            types: ['VerifiableCredential', 'GmCredential'],
          },
          {
            format: 'jwt_vc_json-ld',
            types: ['VerifiableCredential', 'GmCredential'],
          },
          {
            format: 'ldp_vc',
            types: ['VerifiableCredential', 'GmCredential'],
          },
          {
            format: 'mso_mdoc',
            doctype: 'org.iso.18013.5.1.mDL',
          },
        ]);
        expect(query.credential_issuer).toBeDefined();
        expect(query.grants).toStrictEqual({
          'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
            'pre-authorized_code': expect.any(String),
          },
        });

        expect.assertions(4);
      });

      /**
       * Credential offer with pre-authorized_code grant and without user_pin
       */
      it('Pre-authorized_code without user_pin', async () => {
        const credentialOfferRequestData: CredentialOfferRequest = {
          credentials: [
            {
              format: 'jwt_vc_json',
              types: ['VerifiableCredential', 'GmCredential'],
            },
          ],
          grants: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
        };

        const response = await request(server)
          .get('/credential-offer')
          .query(credentialOfferRequestData)
          .send();

        expect(response.status).toBe(200);

        const query = JSON.parse(
          decodeURIComponent(
            response.text.replace(
              'openid_credential_offer://credential_offer?',
              ''
            )
          )
        );

        expect(query.credentials).toStrictEqual([
          {
            format: 'jwt_vc_json',
            types: ['VerifiableCredential', 'GmCredential'],
          },
        ]);
        expect(query.credential_issuer).toBeDefined();
        expect(query.grants).toStrictEqual({
          'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
            'pre-authorized_code': expect.any(String),
          },
        });

        expect.assertions(4);
      });

      /**
       * Credential offer with pre-authorized_code grant and with user_pin set to `false`
       */
      it('Pre-authorized_code with user_pin set to `false`', async () => {
        const credentialOfferRequestData: CredentialOfferRequest = {
          credentials: [
            {
              format: 'jwt_vc_json',
              types: ['VerifiableCredential', 'GmCredential'],
            },
          ],
          grants: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
          userPinRequired: false,
        };

        const response = await request(server)
          .get('/credential-offer')
          .query(credentialOfferRequestData)
          .send();

        expect(response.status).toBe(200);

        const query = JSON.parse(
          decodeURIComponent(
            response.text.replace(
              'openid_credential_offer://credential_offer?',
              ''
            )
          )
        );

        expect(query.credentials).toStrictEqual([
          {
            format: 'jwt_vc_json',
            types: ['VerifiableCredential', 'GmCredential'],
          },
        ]);
        expect(query.credential_issuer).toBeDefined();
        expect(query.grants).toStrictEqual({
          'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
            'pre-authorized_code': expect.any(String),
            user_pin_required: 'false',
          },
        });

        expect.assertions(4);
      });

      /**
       * Credential offer with pre-authorized_code grant and with user_pin set to `true`
       */
      it('Pre-authorized_code with user_pin set to `true`', async () => {
        const credentialOfferRequestData: CredentialOfferRequest = {
          credentials: [
            {
              format: 'jwt_vc_json',
              types: ['VerifiableCredential', 'GmCredential'],
            },
          ],
          grants: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
          userPinRequired: true,
        };

        const response = await request(server)
          .get('/credential-offer')
          .query(credentialOfferRequestData)
          .send();

        expect(response.status).toBe(200);

        const query = JSON.parse(
          decodeURIComponent(
            response.text.replace(
              'openid_credential_offer://credential_offer?',
              ''
            )
          )
        );

        expect(query.credentials).toStrictEqual([
          {
            format: 'jwt_vc_json',
            types: ['VerifiableCredential', 'GmCredential'],
          },
        ]);
        expect(query.credential_issuer).toBeDefined();
        expect(query.grants).toStrictEqual({
          'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
            'pre-authorized_code': expect.any(String),
            user_pin_required: 'true',
          },
        });

        expect.assertions(4);
      });

      /**
       * Credential offer with authorization_code grant
       */
      it('Authorization_code', async () => {
        const credentialOfferRequestData: CredentialOfferRequest = {
          credentials: [
            {
              format: 'jwt_vc_json',
              types: ['VerifiableCredential', 'GmCredential'],
            },
          ],
          grants: ['authorization_code'],
        };

        const response = await request(server)
          .get('/credential-offer')
          .query(credentialOfferRequestData)
          .send();

        expect(response.status).toBe(200);

        const query = JSON.parse(
          decodeURIComponent(
            response.text.replace(
              'openid_credential_offer://credential_offer?',
              ''
            )
          )
        );

        expect(query.credentials).toStrictEqual([
          {
            format: 'jwt_vc_json',
            types: ['VerifiableCredential', 'GmCredential'],
          },
        ]);
        expect(query.credential_issuer).toBeDefined();
        expect(query.grants).toStrictEqual({
          authorization_code: {
            issuer_state: expect.any(String),
          },
        });

        expect.assertions(4);
      });

      /**
       * Credential offer with both pre-authorized_code and authorization_code grant
       */
      it('Pre-authorized_code & authorization_code (user_pin set to `true`)', async () => {
        const credentialOfferRequestData: CredentialOfferRequest = {
          credentials: [
            {
              format: 'jwt_vc_json',
              types: ['VerifiableCredential', 'GmCredential'],
            },
          ],
          grants: [
            'urn:ietf:params:oauth:grant-type:pre-authorized_code',
            'authorization_code',
          ],
          userPinRequired: true,
        };

        const response = await request(server)
          .get('/credential-offer')
          .query(credentialOfferRequestData)
          .send();

        expect(response.status).toBe(200);

        const query = JSON.parse(
          decodeURIComponent(
            response.text.replace(
              'openid_credential_offer://credential_offer?',
              ''
            )
          )
        );

        expect(query.credentials).toStrictEqual([
          {
            format: 'jwt_vc_json',
            types: ['VerifiableCredential', 'GmCredential'],
          },
        ]);
        expect(query.credential_issuer).toBeDefined();
        expect(query.grants).toStrictEqual({
          authorization_code: {
            issuer_state: expect.any(String),
          },
          'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
            'pre-authorized_code': expect.any(String),
            user_pin_required: 'true',
          },
        });

        expect.assertions(4);
      });
    });

    /**
     * Fail cases
     */
    describe('Should fail', () => {
      it('Credential offer with credentials undefined', async () => {
        const response = await request(server)
          .get('/credential-offer')
          .query({
            credentials: undefined,
          })
          .send();

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: 'Requested invalid credentials.',
        });

        expect.assertions(2);
      });

      it('Credential offer with unsopported credentials', async () => {
        const response = await request(server)
          .get('/credential-offer')
          .query({
            credentials: ['UnsupportedCredential', 123, undefined],
          })
          .send();

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: 'No supported credentials found.',
        });

        expect.assertions(2);
      });
    });
  });

  describe('[POST]: /token', () => {
    /**
     * Success cases
     */
    describe('Should succeed', () => {
      it('With pre-authorized_code', async () => {
        const crednetialOfferRequestData: CredentialOfferRequest = {
          credentials: [
            {
              format: 'jwt_vc_json',
              types: ['VerifiableCredential', 'GmCredential'],
            },
          ],
          grants: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
        };

        let response = await request(server)
          .get('/credential-offer')
          .query(crednetialOfferRequestData)
          .send();

        const query = JSON.parse(
          decodeURIComponent(
            response.text.replace(
              'openid_credential_offer://credential_offer?',
              ''
            )
          )
        );

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

        expect(response.body).toStrictEqual({
          access_token: expect.any(String),
          expires_in: expect.any(Number),
          c_nonce: expect.any(String),
          c_nonce_expires_in: expect.any(Number),
          token_type: 'Bearer',
        });

        expect.assertions(3);
      });

      it.todo('With authorization_code');

      it('With pre-authorization_code and user_pin', async () => {
        jest.spyOn(global.Math, 'random').mockReturnValue(0.5);

        const credentialOfferRequestData: CredentialOfferRequest = {
          credentials: [
            {
              format: 'jwt_vc_json',
              types: ['VerifiableCredential', 'GmCredential'],
            },
          ],
          grants: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
          userPinRequired: true,
        };

        let response = await request(server)
          .get('/credential-offer')
          .query(credentialOfferRequestData)
          .send();

        const query = JSON.parse(
          decodeURIComponent(
            response.text.replace(
              'openid_credential_offer://credential_offer?',
              ''
            )
          )
        );

        expect(response.status).toBe(200);

        const tokenRequestData: TokenRequest = {
          grant_type: 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
          'pre-authorized_code': query.grants[
            'urn:ietf:params:oauth:grant-type:pre-authorized_code'
          ]['pre-authorized_code'] as string,
          user_pin: '55555555',
        };

        response = await request(server)
          .post('/token')
          .type('form')
          .send(tokenRequestData);

        expect(response.status).toBe(200);

        expect(response.body).toStrictEqual({
          access_token: expect.any(String),
          expires_in: expect.any(Number),
          c_nonce: expect.any(String),
          c_nonce_expires_in: expect.any(Number),
          token_type: 'Bearer',
        });

        expect.assertions(3);
        jest.spyOn(global.Math, 'random').mockRestore();
      });
    });

    /**
     * Fail cases
     */
    describe('Should fail', () => {
      /**
       * Invalid pre-authorized_code
       */
      it('With invalid pre-authorized_code', async () => {
        jest.spyOn(global.Math, 'random').mockReturnValue(0.5);

        const credentialOfferRequestData: CredentialOfferRequest = {
          credentials: [
            {
              format: 'jwt_vc_json',
              types: ['VerifiableCredential', 'GmCredential'],
            },
          ],
          grants: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
          userPinRequired: true,
        };

        let response = await request(server)
          .get('/credential-offer')
          .query(credentialOfferRequestData)
          .send();

        expect(response.status).toBe(200);

        const tokenRequestData: TokenRequest = {
          grant_type: 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
          'pre-authorized_code': 'invalid',
        };

        response = await request(server)
          .post('/token')
          .type('form')
          .send(tokenRequestData);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: 'Invalid or missing pre-authorized_code.',
        });

        expect.assertions(3);
        jest.spyOn(global.Math, 'random').mockRestore();
      });

      /**
       * Invalid user_pin
       */
      it('With invalid user_pin', async () => {
        jest.spyOn(global.Math, 'random').mockReturnValue(0.5);

        const credentialOfferRequestData: CredentialOfferRequest = {
          credentials: [
            {
              format: 'jwt_vc_json',
              types: ['VerifiableCredential', 'GmCredential'],
            },
          ],
          grants: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
          userPinRequired: true,
        };

        let response = await request(server)
          .get('/credential-offer')
          .query(credentialOfferRequestData)
          .send();

        expect(response.status).toBe(200);

        const query = JSON.parse(
          decodeURIComponent(
            response.text.replace(
              'openid_credential_offer://credential_offer?',
              ''
            )
          )
        );

        const tokenRequestData: TokenRequest = {
          grant_type: 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
          'pre-authorized_code': query.grants[
            'urn:ietf:params:oauth:grant-type:pre-authorized_code'
          ]['pre-authorized_code'] as string,
          user_pin: 'invalid',
        };

        response = await request(server)
          .post('/token')
          .type('form')
          .send(tokenRequestData);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: 'Invalid or missing user_pin.',
        });

        expect.assertions(3);
        jest.spyOn(global.Math, 'random').mockRestore();
      });

      /**
       * Missing pre-authorized_code
       */
      it('With missing pre-authorized_code', async () => {
        jest.spyOn(global.Math, 'random').mockReturnValue(0.5);

        const credentialOfferRequestData: CredentialOfferRequest = {
          credentials: [
            {
              format: 'jwt_vc_json',
              types: ['VerifiableCredential', 'GmCredential'],
            },
          ],
          grants: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
          userPinRequired: true,
        };

        let response = await request(server)
          .get('/credential-offer')
          .query(credentialOfferRequestData)
          .send();

        expect(response.status).toBe(200);

        const tokenRequestData: TokenRequest = {
          grant_type: 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
        };

        response = await request(server)
          .post('/token')
          .type('form')
          .send(tokenRequestData);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: 'Invalid or missing pre-authorized_code.',
        });

        expect.assertions(3);
        jest.spyOn(global.Math, 'random').mockRestore();
      });

      /**
       * Missing user_pin
       */
      it('With missing user_pin', async () => {
        jest.spyOn(global.Math, 'random').mockReturnValue(0.5);

        const credentialOfferRequestData: CredentialOfferRequest = {
          credentials: [
            {
              format: 'jwt_vc_json',
              types: ['VerifiableCredential', 'GmCredential'],
            },
          ],
          grants: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
          userPinRequired: true,
        };

        let response = await request(server)
          .get('/credential-offer')
          .query(credentialOfferRequestData)
          .send();

        expect(response.status).toBe(200);

        const query = JSON.parse(
          decodeURIComponent(
            response.text.replace(
              'openid_credential_offer://credential_offer?',
              ''
            )
          )
        );

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

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: 'Invalid or missing user_pin.',
        });

        expect.assertions(3);
        jest.spyOn(global.Math, 'random').mockRestore();
      });

      /**
       * Unsupported grant_type (authorization_code)
       */
      it('With unsupported grant_type (authorization_code)', async () => {
        jest.spyOn(global.Math, 'random').mockReturnValue(0.5);

        const credentialOfferRequestData: CredentialOfferRequest = {
          credentials: [
            {
              format: 'jwt_vc_json',
              types: ['VerifiableCredential', 'GmCredential'],
            },
          ],
          grants: ['authorization_code'],
        };

        let response = await request(server)
          .get('/credential-offer')
          .query(credentialOfferRequestData)
          .send();

        expect(response.status).toBe(200);

        const tokenRequestData: TokenRequest = {
          grant_type: 'authorization_code',
        };

        response = await request(server)
          .post('/token')
          .type('form')
          .send(tokenRequestData);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'unsupported_grant_type',
          error_description: TOKEN_ERRORS.unsupported_grant_type,
        });

        expect.assertions(3);
        jest.spyOn(global.Math, 'random').mockRestore();
      });
    });
  });

  describe('[POST]: /credential', () => {
    /**
     * Success cases
     */
    describe('Should succeed', () => {
      it('With valid authorization header and valid credential request', async () => {
        const { accessToken, cNonce, supportedCredential } =
          await credOfferAndTokenRequest(server);

        const selectedCredential = (
          supportedCredential.format === 'mso_mdoc'
            ? {
                format: 'mso_mdoc',
                doctype: supportedCredential.doctype,
              }
            : {
                format: supportedCredential.format,
                types: supportedCredential.types,
              }
        ) as SupportedCredential;

        const credentialRequest: CredentialRequest = {
          ...selectedCredential,
          proof: {
            proof_type: 'jwt',
            jwt: await createJWTProof({
              privateKey: TEST_USER_PRIVATE_KEY,
              audience: TEST_ISSUER_URL,
              bindingType: 'kid',
              data: {
                nonce: cNonce,
                exp: Math.floor(Date.now() / 1000) + 1000 * 60 * 60,
              },
              typ: 'openid4vci-proof+jwt',
            }),
          },
        };

        const response = await request(server)
          .post('/credential')
          .auth(accessToken, { type: 'bearer' })
          .send(credentialRequest);

        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual({
          format: 'jwt_vc_json',
          credential: expect.any(String),
        });

        console.log(response.body.credential);
        // Verify credential
        const agent = await getAgent();
        const res = await agent.verifyCredential({
          credential: response.body.credential,
        });

        expect(res.verified).toBeTruthy();

        expect.assertions(6);
      });
    });

    /**
     * Fail cases
     */
    describe('Should fail', () => {
      it('With missing authorization header', async () => {
        const { cNonce, supportedCredential } = await credOfferAndTokenRequest(
          server
        );

        const selectedCredential = (
          supportedCredential.format === 'mso_mdoc'
            ? {
                format: 'mso_mdoc',
                doctype: supportedCredential.doctype,
              }
            : {
                format: supportedCredential.format,
                types: supportedCredential.types,
              }
        ) as SupportedCredential;

        const credentialRequest: CredentialRequest = {
          ...selectedCredential,
          proof: {
            proof_type: 'jwt',
            jwt: await createJWTProof({
              privateKey: TEST_USER_PRIVATE_KEY,
              audience: TEST_ISSUER_URL,
              bindingType: 'kid',
              data: {
                nonce: cNonce,
                exp: Math.floor(Date.now() / 1000) + 1000 * 60 * 60,
              },
              typ: 'openid4vci-proof+jwt',
            }),
          },
        };

        const response = await request(server)
          .post('/credential')
          .send(credentialRequest);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: 'Missing authorization header.',
        });

        expect.assertions(5);
      });

      it('With invalid header format - missing bearer', async () => {
        const { accessToken, cNonce, supportedCredential } =
          await credOfferAndTokenRequest(server);

        const selectedCredential = (
          supportedCredential.format === 'mso_mdoc'
            ? {
                format: 'mso_mdoc',
                doctype: supportedCredential.doctype,
              }
            : {
                format: supportedCredential.format,
                types: supportedCredential.types,
              }
        ) as SupportedCredential;

        const credentialRequest: CredentialRequest = {
          ...selectedCredential,
          proof: {
            proof_type: 'jwt',
            jwt: await createJWTProof({
              privateKey: TEST_USER_PRIVATE_KEY,
              audience: TEST_ISSUER_URL,
              bindingType: 'kid',
              data: {
                nonce: cNonce,
                exp: Math.floor(Date.now() / 1000) + 1000 * 60 * 60,
              },
              typ: 'openid4vci-proof+jwt',
            }),
          },
        };

        const response = await request(server)
          .post('/credential')
          .set('Authorization', `Invalid ${accessToken}`)
          .send(credentialRequest);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: 'Invalid authorization header format.',
        });

        expect.assertions(5);
      });

      it('With invalid header format - missing access token', async () => {
        const { cNonce, supportedCredential } = await credOfferAndTokenRequest(
          server
        );

        const selectedCredential = (
          supportedCredential.format === 'mso_mdoc'
            ? {
                format: 'mso_mdoc',
                doctype: supportedCredential.doctype,
              }
            : {
                format: supportedCredential.format,
                types: supportedCredential.types,
              }
        ) as SupportedCredential;

        const credentialRequest: CredentialRequest = {
          ...selectedCredential,
          proof: {
            proof_type: 'jwt',
            jwt: await createJWTProof({
              privateKey: TEST_USER_PRIVATE_KEY,
              audience: TEST_ISSUER_URL,
              bindingType: 'kid',
              data: {
                nonce: cNonce,
                exp: Math.floor(Date.now() / 1000) + 1000 * 60 * 60,
              },
              typ: 'openid4vci-proof+jwt',
            }),
          },
        };

        const response = await request(server)
          .post('/credential')
          .set('Authorization', `Bearer`)
          .send(credentialRequest);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_token',
          error_description: 'Missing or invalid access token.',
        });

        expect.assertions(5);
      });

      it('With invalid authorization header', async () => {
        const { cNonce, supportedCredential } = await credOfferAndTokenRequest(
          server
        );

        const selectedCredential = (
          supportedCredential.format === 'mso_mdoc'
            ? {
                format: 'mso_mdoc',
                doctype: supportedCredential.doctype,
              }
            : {
                format: supportedCredential.format,
                types: supportedCredential.types,
              }
        ) as SupportedCredential;

        const credentialRequest: CredentialRequest = {
          ...selectedCredential,
          proof: {
            proof_type: 'jwt',
            jwt: await createJWTProof({
              privateKey: TEST_USER_PRIVATE_KEY,
              audience: TEST_ISSUER_URL,
              bindingType: 'kid',
              data: {
                nonce: cNonce,
                exp: Math.floor(Date.now() / 1000) + 1000 * 60 * 60,
              },
              typ: 'openid4vci-proof+jwt',
            }),
          },
        };

        const response = await request(server)
          .post('/credential')
          .auth('invalid', { type: 'bearer' })
          .send(credentialRequest);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_token',
          error_description: 'Missing or invalid access token.',
        });

        expect.assertions(5);
      });

      it('With missing proof', async () => {
        const { accessToken, supportedCredential } =
          await credOfferAndTokenRequest(server);

        const selectedCredential = (
          supportedCredential.format === 'mso_mdoc'
            ? {
                format: 'mso_mdoc',
                doctype: supportedCredential.doctype,
              }
            : {
                format: supportedCredential.format,
                types: supportedCredential.types,
              }
        ) as SupportedCredential;

        const credentialRequest: CredentialRequest = {
          ...selectedCredential,
        };

        const response = await request(server)
          .post('/credential')
          .auth(accessToken, { type: 'bearer' })
          .send(credentialRequest);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_or_missing_proof',

          error_description: 'Proof is required.',
        });

        expect.assertions(5);
      });

      it('With missing proof type', async () => {
        const { accessToken, cNonce, supportedCredential } =
          await credOfferAndTokenRequest(server);

        const selectedCredential = (
          supportedCredential.format === 'mso_mdoc'
            ? {
                format: 'mso_mdoc',
                doctype: supportedCredential.doctype,
              }
            : {
                format: supportedCredential.format,
                types: supportedCredential.types,
              }
        ) as SupportedCredential;

        const credentialRequest = {
          ...selectedCredential,
          proof: {
            jwt: await createJWTProof({
              privateKey: TEST_USER_PRIVATE_KEY,
              audience: TEST_ISSUER_URL,
              bindingType: 'kid',
              data: {
                nonce: cNonce,
                exp: Math.floor(Date.now() / 1000) + 1000 * 60 * 60,
              },
              typ: 'openid4vci-proof+jwt',
            }),
          },
        };

        const response = await request(server)
          .post('/credential')
          .auth(accessToken, { type: 'bearer' })
          .send(credentialRequest);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_or_missing_proof',
          error_description: 'Proof format missing or not supported.',
        });

        expect.assertions(5);
      });

      it('With invalid proof type', async () => {
        const { accessToken, cNonce, supportedCredential } =
          await credOfferAndTokenRequest(server);

        const selectedCredential = (
          supportedCredential.format === 'mso_mdoc'
            ? {
                format: 'mso_mdoc',
                doctype: supportedCredential.doctype,
              }
            : {
                format: supportedCredential.format,
                types: supportedCredential.types,
              }
        ) as SupportedCredential;

        const credentialRequest = {
          ...selectedCredential,
          proof: {
            proof_type: 'invalid',
            jwt: await createJWTProof({
              privateKey: TEST_USER_PRIVATE_KEY,
              audience: TEST_ISSUER_URL,
              bindingType: 'kid',
              data: {
                nonce: cNonce,
                exp: Math.floor(Date.now() / 1000) + 1000 * 60 * 60,
              },
              typ: 'openid4vci-proof+jwt',
            }),
          },
        };

        const response = await request(server)
          .post('/credential')
          .auth(accessToken, { type: 'bearer' })
          .send(credentialRequest);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_or_missing_proof',
          error_description: 'Proof format missing or not supported.',
        });

        expect.assertions(5);
      });

      it('With missing proof jwt', async () => {
        const { accessToken, supportedCredential } =
          await credOfferAndTokenRequest(server);

        const selectedCredential = (
          supportedCredential.format === 'mso_mdoc'
            ? {
                format: 'mso_mdoc',
                doctype: supportedCredential.doctype,
              }
            : {
                format: supportedCredential.format,
                types: supportedCredential.types,
              }
        ) as SupportedCredential;

        const credentialRequest = {
          ...selectedCredential,
          proof: {
            proof_type: 'jwt',
          },
        };

        const response = await request(server)
          .post('/credential')
          .auth(accessToken, { type: 'bearer' })
          .send(credentialRequest);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_or_missing_proof',
          error_description: 'Missing or invalid jwt.',
        });

        expect.assertions(5);
      });

      it('With invalid jwt header', async () => {
        const { accessToken, cNonce, supportedCredential } =
          await credOfferAndTokenRequest(server);

        const selectedCredential = (
          supportedCredential.format === 'mso_mdoc'
            ? {
                format: 'mso_mdoc',
                doctype: supportedCredential.doctype,
              }
            : {
                format: supportedCredential.format,
                types: supportedCredential.types,
              }
        ) as SupportedCredential;

        const credentialRequest = {
          ...selectedCredential,
          proof: {
            proof_type: 'jwt',
            jwt: await createJWTProof({
              privateKey: TEST_USER_PRIVATE_KEY,
              audience: TEST_ISSUER_URL,
              bindingType: 'kid',
              data: {
                nonce: cNonce,
                exp: Math.floor(Date.now() / 1000) + 1000 * 60 * 60,
              },
              typ: 'openid4vci-proof+jwt',
              invalidHeader: true,
            }),
          },
        };

        const response = await request(server)
          .post('/credential')
          .auth(accessToken, { type: 'bearer' })
          .send(credentialRequest);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: 'Invalid jwt header.',
        });

        expect.assertions(5);
      });

      it('With multiple of kid, jwk and x5c in jwt header', async () => {
        const { accessToken, cNonce, supportedCredential } =
          await credOfferAndTokenRequest(server);

        const selectedCredential = (
          supportedCredential.format === 'mso_mdoc'
            ? {
                format: 'mso_mdoc',
                doctype: supportedCredential.doctype,
              }
            : {
                format: supportedCredential.format,
                types: supportedCredential.types,
              }
        ) as SupportedCredential;

        const credentialRequest = {
          ...selectedCredential,
          proof: {
            proof_type: 'jwt',
            jwt: await createJWTProof({
              privateKey: TEST_USER_PRIVATE_KEY,
              audience: TEST_ISSUER_URL,
              bindingType: 'kid',
              data: {
                nonce: cNonce,
                exp: Math.floor(Date.now() / 1000) + 1000 * 60 * 60,
              },
              typ: 'openid4vci-proof+jwt',
              headerExtra: {
                x5c: 'Random x5c',
                jwk: 'Random jwk',
              },
            }),
          },
        };

        const response = await request(server)
          .post('/credential')
          .auth(accessToken, { type: 'bearer' })
          .send(credentialRequest);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: 'Exactly one of kid, jwk, x5c must be present.',
        });

        expect.assertions(5);
      });

      it('With missing jwt typ', async () => {
        const { accessToken, cNonce, supportedCredential } =
          await credOfferAndTokenRequest(server);

        const selectedCredential = (
          supportedCredential.format === 'mso_mdoc'
            ? {
                format: 'mso_mdoc',
                doctype: supportedCredential.doctype,
              }
            : {
                format: supportedCredential.format,
                types: supportedCredential.types,
              }
        ) as SupportedCredential;

        const credentialRequest = {
          ...selectedCredential,
          proof: {
            proof_type: 'jwt',
            jwt: await createJWTProof({
              privateKey: TEST_USER_PRIVATE_KEY,
              audience: TEST_ISSUER_URL,
              bindingType: 'kid',
              data: {
                nonce: cNonce,
                exp: Math.floor(Date.now() / 1000) + 1000 * 60 * 60,
              },
            }),
          },
        };

        const response = await request(server)
          .post('/credential')
          .auth(accessToken, { type: 'bearer' })
          .send(credentialRequest);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description:
            'Invalid JWT typ. Expected "openid4vci-proof+jwt" but got "undefined".',
        });

        expect.assertions(5);
      });

      it('With invalid jwt typ', async () => {
        const { accessToken, cNonce, supportedCredential } =
          await credOfferAndTokenRequest(server);

        const selectedCredential = (
          supportedCredential.format === 'mso_mdoc'
            ? {
                format: 'mso_mdoc',
                doctype: supportedCredential.doctype,
              }
            : {
                format: supportedCredential.format,
                types: supportedCredential.types,
              }
        ) as SupportedCredential;

        const credentialRequest = {
          ...selectedCredential,
          proof: {
            proof_type: 'jwt',
            jwt: await createJWTProof({
              privateKey: TEST_USER_PRIVATE_KEY,
              audience: TEST_ISSUER_URL,
              bindingType: 'kid',
              typ: 'random_invalid_typ',
              data: {
                nonce: cNonce,
                exp: Math.floor(Date.now() / 1000) + 1000 * 60 * 60,
              },
            }),
          },
        };

        const response = await request(server)
          .post('/credential')
          .auth(accessToken, { type: 'bearer' })
          .send(credentialRequest);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description:
            'Invalid JWT typ. Expected "openid4vci-proof+jwt" but got "random_invalid_typ".',
        });

        expect.assertions(5);
      });

      it('With missing did', async () => {
        const { accessToken, cNonce, supportedCredential } =
          await credOfferAndTokenRequest(server);

        const selectedCredential = (
          supportedCredential.format === 'mso_mdoc'
            ? {
                format: 'mso_mdoc',
                doctype: supportedCredential.doctype,
              }
            : {
                format: supportedCredential.format,
                types: supportedCredential.types,
              }
        ) as SupportedCredential;

        const credentialRequest = {
          ...selectedCredential,
          proof: {
            proof_type: 'jwt',
            jwt: await createJWTProof({
              privateKey: TEST_USER_PRIVATE_KEY,
              audience: TEST_ISSUER_URL,
              bindingType: 'kid',
              data: {
                nonce: cNonce,
                exp: Math.floor(Date.now() / 1000) + 1000 * 60 * 60,
              },
              typ: 'openid4vci-proof+jwt',
              headerExtra: {
                kid: '#controllerKey',
              },
            }),
          },
        };

        const response = await request(server)
          .post('/credential')
          .auth(accessToken, { type: 'bearer' })
          .send(credentialRequest);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: 'Invalid kid.',
        });

        expect.assertions(5);
      });

      it('With invalid did', async () => {
        const { accessToken, cNonce, supportedCredential } =
          await credOfferAndTokenRequest(server);

        const selectedCredential = (
          supportedCredential.format === 'mso_mdoc'
            ? {
                format: 'mso_mdoc',
                doctype: supportedCredential.doctype,
              }
            : {
                format: supportedCredential.format,
                types: supportedCredential.types,
              }
        ) as SupportedCredential;

        const credentialRequest = {
          ...selectedCredential,
          proof: {
            proof_type: 'jwt',
            jwt: await createJWTProof({
              privateKey: TEST_USER_PRIVATE_KEY,
              audience: TEST_ISSUER_URL,
              bindingType: 'kid',
              data: {
                nonce: cNonce,
                exp: Math.floor(Date.now() / 1000) + 1000 * 60 * 60,
              },
              typ: 'openid4vci-proof+jwt',
              headerExtra: {
                kid: 'invalid#controllerKey',
              },
            }),
          },
        };

        const response = await request(server)
          .post('/credential')
          .auth(accessToken, { type: 'bearer' })
          .send(credentialRequest);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: 'Error resolving did. Reason: invalidDid.',
        });

        expect.assertions(5);
      });

      it.todo('With publickKeyJwk');
      it.todo('With invalid public key');
      it.todo('With invalid key type');

      it('With jwk', async () => {
        const { accessToken, cNonce, supportedCredential } =
          await credOfferAndTokenRequest(server);

        const selectedCredential = (
          supportedCredential.format === 'mso_mdoc'
            ? {
                format: 'mso_mdoc',
                doctype: supportedCredential.doctype,
              }
            : {
                format: supportedCredential.format,
                types: supportedCredential.types,
              }
        ) as SupportedCredential;

        const credentialRequest: CredentialRequest = {
          ...selectedCredential,
          proof: {
            proof_type: 'jwt',
            jwt: await createJWTProof({
              privateKey: TEST_USER_PRIVATE_KEY,
              audience: TEST_ISSUER_URL,
              bindingType: 'jwk',
              typ: 'openid4vci-proof+jwt',
              data: {
                nonce: cNonce,
                exp: Math.floor(Date.now() / 1000) + 1000 * 60 * 60,
              },
            }),
          },
        };

        const response = await request(server)
          .post('/credential')
          .auth(accessToken, { type: 'bearer' })
          .send(credentialRequest);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: 'jwk not supported.',
        });

        expect.assertions(5);
      });

      it('With x5c', async () => {
        const { accessToken, cNonce, supportedCredential } =
          await credOfferAndTokenRequest(server);

        const selectedCredential = (
          supportedCredential.format === 'mso_mdoc'
            ? {
                format: 'mso_mdoc',
                doctype: supportedCredential.doctype,
              }
            : {
                format: supportedCredential.format,
                types: supportedCredential.types,
              }
        ) as SupportedCredential;

        const credentialRequest: CredentialRequest = {
          ...selectedCredential,
          proof: {
            proof_type: 'jwt',
            jwt: await createJWTProof({
              privateKey: TEST_USER_PRIVATE_KEY,
              audience: TEST_ISSUER_URL,
              bindingType: 'x5c',
              typ: 'openid4vci-proof+jwt',
              data: {
                nonce: cNonce,
                exp: Math.floor(Date.now() / 1000) + 1000 * 60 * 60,
              },
            }),
          },
        };

        const response = await request(server)
          .post('/credential')
          .auth(accessToken, { type: 'bearer' })
          .send(credentialRequest);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: 'x5c not supported.',
        });

        expect.assertions(5);
      });

      it('With missing audience', async () => {
        const { accessToken, cNonce, supportedCredential } =
          await credOfferAndTokenRequest(server);

        const selectedCredential = (
          supportedCredential.format === 'mso_mdoc'
            ? {
                format: 'mso_mdoc',
                doctype: supportedCredential.doctype,
              }
            : {
                format: supportedCredential.format,
                types: supportedCredential.types,
              }
        ) as SupportedCredential;

        const credentialRequest: CredentialRequest = {
          ...selectedCredential,
          proof: {
            proof_type: 'jwt',
            jwt: await createJWTProof({
              privateKey: TEST_USER_PRIVATE_KEY,
              bindingType: 'kid',
              data: {
                nonce: cNonce,
                exp: Math.floor(Date.now() / 1000) + 1000 * 60 * 60,
              },
              typ: 'openid4vci-proof+jwt',
            }),
          },
        };

        const response = await request(server)
          .post('/credential')
          .auth(accessToken, { type: 'bearer' })
          .send(credentialRequest);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_or_missing_proof',
          error_description:
            'JWTClaimValidationFailed: missing required "aud" claim',
        });

        expect.assertions(5);
      });

      it('With invalid audience', async () => {
        const { accessToken, cNonce, supportedCredential } =
          await credOfferAndTokenRequest(server);

        const selectedCredential = (
          supportedCredential.format === 'mso_mdoc'
            ? {
                format: 'mso_mdoc',
                doctype: supportedCredential.doctype,
              }
            : {
                format: supportedCredential.format,
                types: supportedCredential.types,
              }
        ) as SupportedCredential;

        const credentialRequest: CredentialRequest = {
          ...selectedCredential,
          proof: {
            proof_type: 'jwt',
            jwt: await createJWTProof({
              privateKey: TEST_USER_PRIVATE_KEY,
              audience: 'invalid',
              bindingType: 'kid',
              data: {
                nonce: cNonce,
                exp: Math.floor(Date.now() / 1000) + 1000 * 60 * 60,
              },
              typ: 'openid4vci-proof+jwt',
            }),
          },
        };

        const response = await request(server)
          .post('/credential')
          .auth(accessToken, { type: 'bearer' })
          .send(credentialRequest);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_or_missing_proof',
          error_description:
            'JWTClaimValidationFailed: unexpected "aud" claim value',
        });

        expect.assertions(5);
      });

      it('With missing nonce', async () => {
        const { accessToken, supportedCredential } =
          await credOfferAndTokenRequest(server);

        const selectedCredential = (
          supportedCredential.format === 'mso_mdoc'
            ? {
                format: 'mso_mdoc',
                doctype: supportedCredential.doctype,
              }
            : {
                format: supportedCredential.format,
                types: supportedCredential.types,
              }
        ) as SupportedCredential;

        const credentialRequest: CredentialRequest = {
          ...selectedCredential,
          proof: {
            proof_type: 'jwt',
            jwt: await createJWTProof({
              privateKey: TEST_USER_PRIVATE_KEY,
              audience: TEST_ISSUER_URL,
              bindingType: 'kid',
              data: {
                exp: Math.floor(Date.now() / 1000) + 1000 * 60 * 60,
              },
              typ: 'openid4vci-proof+jwt',
            }),
          },
        };

        const response = await request(server)
          .post('/credential')
          .auth(accessToken, { type: 'bearer' })
          .send(credentialRequest);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_or_missing_proof',
          error_description: 'Invalid or missing nonce.',
        });

        expect.assertions(5);
      });

      it('With invalid nonce', async () => {
        const { accessToken, supportedCredential } =
          await credOfferAndTokenRequest(server);

        const selectedCredential = (
          supportedCredential.format === 'mso_mdoc'
            ? {
                format: 'mso_mdoc',
                doctype: supportedCredential.doctype,
              }
            : {
                format: supportedCredential.format,
                types: supportedCredential.types,
              }
        ) as SupportedCredential;

        const credentialRequest: CredentialRequest = {
          ...selectedCredential,
          proof: {
            proof_type: 'jwt',
            jwt: await createJWTProof({
              privateKey: TEST_USER_PRIVATE_KEY,
              audience: TEST_ISSUER_URL,
              bindingType: 'kid',
              data: {
                nonce: 'invalid',
                exp: Math.floor(Date.now() / 1000) + 1000 * 60 * 60,
              },
              typ: 'openid4vci-proof+jwt',
            }),
          },
        };

        const response = await request(server)
          .post('/credential')
          .auth(accessToken, { type: 'bearer' })
          .send(credentialRequest);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_or_missing_proof',
          error_description: 'Invalid or missing nonce.',
        });

        expect.assertions(5);
      });

      it('With expired jwt', async () => {
        const { accessToken, supportedCredential } =
          await credOfferAndTokenRequest(server);

        const selectedCredential = (
          supportedCredential.format === 'mso_mdoc'
            ? {
                format: 'mso_mdoc',
                doctype: supportedCredential.doctype,
              }
            : {
                format: supportedCredential.format,
                types: supportedCredential.types,
              }
        ) as SupportedCredential;

        const credentialRequest: CredentialRequest = {
          ...selectedCredential,
          proof: {
            proof_type: 'jwt',
            jwt: await createJWTProof({
              privateKey: TEST_USER_PRIVATE_KEY,
              audience: TEST_ISSUER_URL,
              bindingType: 'kid',
              data: {
                nonce: 'invalid',
                exp: Math.floor(Date.now() / 1000) - 1000,
              },
              typ: 'openid4vci-proof+jwt',
            }),
          },
        };

        const response = await request(server)
          .post('/credential')
          .auth(accessToken, { type: 'bearer' })
          .send(credentialRequest);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_or_missing_proof',
          error_description: 'JWTExpired: "exp" claim timestamp check failed',
        });

        expect.assertions(5);
      });

      it('With jwt not valid yet', async () => {
        const { accessToken, supportedCredential } =
          await credOfferAndTokenRequest(server);

        const selectedCredential = (
          supportedCredential.format === 'mso_mdoc'
            ? {
                format: 'mso_mdoc',
                doctype: supportedCredential.doctype,
              }
            : {
                format: supportedCredential.format,
                types: supportedCredential.types,
              }
        ) as SupportedCredential;

        const credentialRequest: CredentialRequest = {
          ...selectedCredential,
          proof: {
            proof_type: 'jwt',
            jwt: await createJWTProof({
              privateKey: TEST_USER_PRIVATE_KEY,
              audience: TEST_ISSUER_URL,
              bindingType: 'kid',
              data: {
                nonce: 'invalid',
                exp: Math.floor(Date.now() / 1000) + 1000 * 60 * 60,
                nbf: Math.floor(Date.now() / 1000) + 1000 * 60 * 60,
              },
              typ: 'openid4vci-proof+jwt',
            }),
          },
        };

        const response = await request(server)
          .post('/credential')
          .auth(accessToken, { type: 'bearer' })
          .send(credentialRequest);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_or_missing_proof',
          error_description:
            'JWTClaimValidationFailed: "nbf" claim timestamp check failed',
        });

        expect.assertions(5);
      });

      it('With missing format', async () => {
        const { accessToken, cNonce, supportedCredential } =
          await credOfferAndTokenRequest(server);

        const selectedCredential =
          supportedCredential.format === 'mso_mdoc'
            ? {
                doctype: supportedCredential.doctype,
              }
            : {
                types: supportedCredential.types,
              };

        const credentialRequest = {
          ...selectedCredential,
          proof: {
            proof_type: 'jwt',
            jwt: await createJWTProof({
              privateKey: TEST_USER_PRIVATE_KEY,
              audience: TEST_ISSUER_URL,
              bindingType: 'kid',
              data: {
                nonce: cNonce,
                exp: Math.floor(Date.now() / 1000) + 1000 * 60 * 60,
              },
              typ: 'openid4vci-proof+jwt',
            }),
          },
        };

        const response = await request(server)
          .post('/credential')
          .auth(accessToken, { type: 'bearer' })
          .send(credentialRequest);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: 'Missing format.',
        });

        expect.assertions(5);
      });

      it('With unsopported credential', async () => {
        const { accessToken, cNonce } = await credOfferAndTokenRequest(server);

        const credentialRequest = {
          format: 'jwt_vc_json',
          types: ['unsupported'],
          proof: {
            proof_type: 'jwt',
            jwt: await createJWTProof({
              privateKey: TEST_USER_PRIVATE_KEY,
              audience: TEST_ISSUER_URL,
              bindingType: 'kid',
              data: {
                nonce: cNonce,
                exp: Math.floor(Date.now() / 1000) + 1000 * 60 * 60,
              },
              typ: 'openid4vci-proof+jwt',
            }),
          },
        };

        const response = await request(server)
          .post('/credential')
          .auth(accessToken, { type: 'bearer' })
          .send(credentialRequest);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: 'Unsupported credential.',
        });

        expect.assertions(5);
      });

      it('With mso_mdoc credential', async () => {
        const { accessToken, cNonce } = await credOfferAndTokenRequest(server);

        const credentialRequest = {
          format: 'mso_mdoc',
          doctype: 'org.iso.18013.5.1.mDL',
          proof: {
            proof_type: 'jwt',
            jwt: await createJWTProof({
              privateKey: TEST_USER_PRIVATE_KEY,
              audience: TEST_ISSUER_URL,
              bindingType: 'kid',
              data: {
                nonce: cNonce,
                exp: Math.floor(Date.now() / 1000) + 1000 * 60 * 60,
              },
              typ: 'openid4vci-proof+jwt',
            }),
          },
        };

        const response = await request(server)
          .post('/credential')
          .auth(accessToken, { type: 'bearer' })
          .send(credentialRequest);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: 'Currently the mso_mdoc format is not supported.',
        });

        expect.assertions(5);
      });
    });
  });
});
