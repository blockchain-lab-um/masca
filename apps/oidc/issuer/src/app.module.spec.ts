import {
  CredentialRequest,
  SupportedCredential,
  TokenRequest,
  TokenResponse,
} from '@blockchain-lab-um/oidc-types';
import { jest } from '@jest/globals';
import { HttpServer } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
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

// import { IConfig } from './config/configuration';

describe('Issuer controller', () => {
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

  // const client = await OpenID4VCIClient.initiateFromURI({
  //   issuanceInitiationURI:
  //     'openid-initiate-issuance://?issuer=http%3A%2F%2F127.0.01:3000&credential_type=OpenBadgeCredentialUrl&pre-authorized_code=4jLs9xZHEfqcoow0kHE7d1a8hUk6Sy-5bVSV2MqBUGUgiFFQi-ImL62T-FmLIo8hKA1UdMPH0lM1xAgcFkJfxIw9L-lI3mVs0hRT8YVwsEM1ma6N3wzuCdwtMU4bcwKp&user_pin_required=true',
  //   flowType: AuthzFlowType.PRE_AUTHORIZED_CODE_FLOW, // The flow to use
  //   kid: 'did:example:ebfeb1f712ebc6f1c276e12ec21#key-1', // Our DID.  You can defer this also to when the acquireCredential method is called
  //   alg: Alg.ES256, // The signing Algorithm we will use. You can defer this also to when the acquireCredential method is called
  //   clientId: 'test-clientId', // The clientId if the Authrozation Service requires it.  If a clientId is needed you can defer this also to when the acquireAccessToken method is called
  //   retrieveServerMetadata: true, // Already retrieve the server metadata. Can also be done afterwards by invoking a method yourself.
  // });

  // console.log(
  //   await client.acquireAccessToken({
  //     pin: '55555555',
  //   })
  // );

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
      it('Credential offer by credential id', async () => {
        const response = await request(server)
          .get('/credential-offer')
          .query({
            credentials: ['ProgramCompletionCertificate'],
            grants: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
          })
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
          'ProgramCompletionCertificate',
        ]);
        expect(query.credential_issuer).toBeDefined();
        expect(query.grants).toStrictEqual({
          'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
            'pre-authorized_code': expect.any(String),
          },
        });

        expect.assertions(4);
      });

      it('Credential offer by jwt_vc_json format and types array', async () => {
        const response = await request(server)
          .get('/credential-offer')
          .query({
            credentials: [
              {
                format: 'jwt_vc_json',
                types: ['VerifiableCredential', 'ProgramCompletionCertificate'],
              },
            ],
            grants: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
          })
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
            types: ['VerifiableCredential', 'ProgramCompletionCertificate'],
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

      it('Credential offer by jwt_vc_json-ld format and types array', async () => {
        const response = await request(server)
          .get('/credential-offer')
          .query({
            credentials: [
              {
                format: 'jwt_vc_json-ld',
                types: ['VerifiableCredential', 'ProgramCompletionCertificate'],
              },
            ],
            grants: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
          })
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
            types: ['VerifiableCredential', 'ProgramCompletionCertificate'],
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

      it('Credential offer by ldp_vc format and types array', async () => {
        const response = await request(server)
          .get('/credential-offer')
          .query({
            credentials: [
              {
                format: 'ldp_vc',
                types: ['VerifiableCredential', 'ProgramCompletionCertificate'],
              },
            ],
            grants: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
          })
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
            types: ['VerifiableCredential', 'ProgramCompletionCertificate'],
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

      it('Credential offer by multiple formats', async () => {
        const response = await request(server)
          .get('/credential-offer')
          .query(
            qs.stringify({
              credentials: [
                {
                  format: 'jwt_vc_json',
                  types: [
                    'VerifiableCredential',
                    'ProgramCompletionCertificate',
                  ],
                },
                {
                  format: 'jwt_vc_json-ld',
                  types: [
                    'VerifiableCredential',
                    'ProgramCompletionCertificate',
                  ],
                },
                {
                  format: 'ldp_vc',
                  types: [
                    'VerifiableCredential',
                    'ProgramCompletionCertificate',
                  ],
                },
                {
                  format: 'mso_mdoc',
                  doctype: 'org.iso.18013.5.1.mDL',
                },
              ],
              grants: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
            })
          )
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
            types: ['VerifiableCredential', 'ProgramCompletionCertificate'],
          },
          {
            format: 'jwt_vc_json-ld',
            types: ['VerifiableCredential', 'ProgramCompletionCertificate'],
          },
          {
            format: 'ldp_vc',
            types: ['VerifiableCredential', 'ProgramCompletionCertificate'],
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

      it('Pre-authorized_code without user_pin', async () => {
        const response = await request(server)
          .get('/credential-offer')
          .query({
            credentials: [
              {
                format: 'jwt_vc_json',
                types: ['VerifiableCredential', 'ProgramCompletionCertificate'],
              },
            ],
            grants: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
          })
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
            types: ['VerifiableCredential', 'ProgramCompletionCertificate'],
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

      it('Pre-authorized_code with user_pin set to `false`', async () => {
        const response = await request(server)
          .get('/credential-offer')
          .query({
            credentials: [
              {
                format: 'jwt_vc_json',
                types: ['VerifiableCredential', 'ProgramCompletionCertificate'],
              },
            ],
            grants: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
            userPinRequired: false,
          })
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
            types: ['VerifiableCredential', 'ProgramCompletionCertificate'],
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

      it('Pre-authorized_code with user_pin set to `true`', async () => {
        const response = await request(server)
          .get('/credential-offer')
          .query({
            credentials: [
              {
                format: 'jwt_vc_json',
                types: ['VerifiableCredential', 'ProgramCompletionCertificate'],
              },
            ],
            grants: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
            userPinRequired: true,
          })
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
            types: ['VerifiableCredential', 'ProgramCompletionCertificate'],
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

      it('Authorization_code', async () => {
        const response = await request(server)
          .get('/credential-offer')
          .query({
            credentials: [
              {
                format: 'jwt_vc_json',
                types: ['VerifiableCredential', 'ProgramCompletionCertificate'],
              },
            ],
            grants: ['authorization_code'],
          })
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
            types: ['VerifiableCredential', 'ProgramCompletionCertificate'],
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

      it('Pre-authorized_code & authorization_code (user_pin set to `true`)', async () => {
        const response = await request(server)
          .get('/credential-offer')
          .query({
            credentials: [
              {
                format: 'jwt_vc_json',
                types: ['VerifiableCredential', 'ProgramCompletionCertificate'],
              },
            ],
            grants: [
              'urn:ietf:params:oauth:grant-type:pre-authorized_code',
              'authorization_code',
            ],
            userPinRequired: true,
          })
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
            types: ['VerifiableCredential', 'ProgramCompletionCertificate'],
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

    describe('Should fail', () => {
      it.todo("Add 'Should fail' tests");
    });
  });

  describe('[POST]: /token', () => {
    describe('Should succeed', () => {
      it('With pre-authorized_code', async () => {
        let response = await request(server)
          .get('/credential-offer')
          .query({
            credentials: [
              {
                format: 'jwt_vc_json',
                types: ['VerifiableCredential', 'ProgramCompletionCertificate'],
              },
            ],
            grants: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
          })
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
        let response = await request(server)
          .get('/credential-offer')
          .query({
            credentials: [
              {
                format: 'jwt_vc_json',
                types: ['VerifiableCredential', 'ProgramCompletionCertificate'],
              },
            ],
            grants: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
            userPinRequired: true,
          })
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

    describe('Should fail', () => {
      it.todo('With invalid pre-authorized_code');
      it.todo('With invalid user_pin');
      it.todo('With missing pre-authorized_code');
      it.todo('With missing user_pin');
    });
  });

  describe('[POST]: /credential', () => {
    describe('Should succeed', () => {
      it('With valid authorization header and valid credential request', async () => {
        let response = await request(server)
          .get('/credential-offer')
          .query({
            credentials: ['ProgramCompletionCertificate'],
            grants: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
          })
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
              data: {
                nonce: cNonce,
                exp: Math.floor(Date.now() / 1000) + 1000 * 60 * 60,
              },
              typ: 'openid4vci-proof+jwt',
            }),
          },
        };

        response = await request(server)
          .post('/credential')
          .auth(accessToken, { type: 'bearer' })
          .send(credentialRequest);

        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual({
          format: 'jwt_vc_json',
          credential: expect.any(String),
        });

        // Verify credential
        const agent = await getAgent();
        const res = await agent.verifyCredential({
          credential: response.body.credential,
        });

        expect(res.verified).toBeTruthy();

        expect.assertions(6);
      });
    });

    describe('Should fail', () => {
      it.todo('With invalid authorization header');
      it.todo('With missing nonce');
    });
  });
});
