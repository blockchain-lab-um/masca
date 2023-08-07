import { randomUUID } from 'crypto';
import { PresentationDefinition } from '@blockchain-lab-um/oidc-types';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { PEX } from '@sphereon/pex';
import { RawServerDefault } from 'fastify';
import * as qs from 'qs';
import request from 'supertest';

import { TEST_USER_PRIVATE_KEY } from '../tests/constants.js';
import getAgent from '../tests/testAgent.js';
import { createJWTProof, importDid } from '../tests/utils.js';
import { AppModule } from './app.module.js';
import AllExceptionsFilter from './filters/all-exceptions.filter.js';

const pex: PEX = new PEX();

describe('Verifier controler', () => {
  let app: NestFastifyApplication;
  let server: RawServerDefault;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const fastifyAdapter = new FastifyAdapter();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, global-require, @typescript-eslint/no-var-requires
    await fastifyAdapter.register(require('@fastify/formbody'), {
      parser: (str: string) =>
        qs.parse(str, {
          depth: 50,
          parameterLimit: 1000,
        }),
    });

    app = testingModule.createNestApplication<NestFastifyApplication>(
      fastifyAdapter,
      { bodyParser: false }
    );

    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    server = app.getHttpServer();
  });

  describe('[GET]: /authorization-request', () => {
    /**
     * Success cases
     */
    describe('Should succeed', () => {
      /**
       * Authorization request with valid state (UUID) and credential type
       */
      it('Should succeed with valid state and credential type', async () => {
        const state = randomUUID();
        const response = await request(server)
          .get('/authorization-request')
          .query({
            credentialType: 'test_presentation_definition_1',
            state,
          })
          .send();

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe(
          'text/plain; charset=utf-8'
        );

        const query = qs.parse(response.text.replace('openid://?', ''), {
          depth: 50,
          parameterLimit: 1000,
        });

        expect(query).toStrictEqual({
          response_type: 'vp_token id_token',
          client_id: expect.any(String),
          redirect_uri: expect.any(String),
          scope: 'openid',
          id_token_type: 'subject_signed',
          nonce: expect.any(String),
          presentation_definition: {
            id: 'test_presentation_definition_1',
            format: {
              jwt_vc: {
                alg: ['ES256K'],
              },
              jwt_vp: {
                alg: ['ES256K'],
              },
            },
            input_descriptors: [
              {
                id: 'GmCredential',
                name: 'Gm Credential',
                purpose: 'To verify you have a valid GmCredential',
                constraints: {
                  fields: [
                    {
                      path: ['$.type.*'],
                      filter: {
                        type: 'string',
                        pattern: 'GmCredential',
                      },
                    },
                  ],
                },
              },
            ],
          },
          state,
        });

        expect.assertions(3);
      });
    });

    /**
     * Fail cases
     */
    describe('Should fail', () => {
      /**
       * Unsupported credential type
       */
      it('Should fail with unsupported credential type', async () => {
        const state = randomUUID();
        const response = await request(server)
          .get('/authorization-request')
          .query({
            credentialType: 'wrong_credential_type',
            state,
          })
          .send();

        expect(response.status).toBe(400);

        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: 'Presentation definition not supported.',
        });

        expect.assertions(2);
      });

      /**
       * Missing credential type
       */
      it('Should fail with missing credential type', async () => {
        const state = randomUUID();
        const response = await request(server)
          .get('/authorization-request')
          .query({
            state,
          })
          .send();

        expect(response.status).toBe(400);

        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: 'Credential type is required.',
        });

        expect.assertions(2);
      });

      /**
       * Missing state
       * */
      it('Should fail with missing state', async () => {
        const response = await request(server)
          .get('/authorization-request')
          .query({
            credentialType: 'test_presentation_definition_1',
          })
          .send();

        expect(response.status).toBe(400);

        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: 'State is required.',
        });

        expect.assertions(2);
      });
    });
  });

  describe('[POST]: /authorization-response', () => {
    /**
     * Success cases
     */
    describe('Should succeed', () => {
      it('With valid VC, valid VP and valid presentation submission', async () => {
        const state = randomUUID();
        let response = await request(server)
          .get('/authorization-request')
          .query({
            credentialType: 'test_presentation_definition_1',
            state,
          })
          .send();

        expect(response.status).toBe(200);

        const query = qs.parse(response.text.replace('openid://?', ''), {
          depth: 50,
          parameterLimit: 1000,
        });

        const agent = await getAgent();

        // Import the did of the test user
        const identifier = await importDid({
          agent,
          privateKey: TEST_USER_PRIVATE_KEY,
          alias: 'testuser',
        });

        const jwtVc =
          'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiR21DcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQifSwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9kaXNjb3h5ei9kaXNjby1zY2hlbWFzL21haW4vanNvbi9HTUNyZWRlbnRpYWwvMS0wLTAuanNvbiIsInR5cGUiOiJKc29uU2NoZW1hVmFsaWRhdG9yMjAxOCJ9fSwic3ViIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQiLCJuYmYiOjE2ODM2MzU2MjcsImlzcyI6ImRpZDpldGhyOjB4MDI4MGE5Y2Q0OGZkNDM2ZjhjMWY4MWIxNTZlYjYxNTYxOGNkNTczYzNlYjFlNmQ5MzdhMTdiODIyMjAyN2NhZTg1In0.D3BzC5d-KqUqtbxHpob3RVom5AmPk34xXqFA2ZOV26VIbQu1vCdWfZfkMfnEpOaztk3lXoab3ImuLgFI4_Lttg';

        const { verifiableCredential } = pex.selectFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          [jwtVc]
        );

        const presentationSubmission = pex.presentationSubmissionFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          verifiableCredential ?? []
        );

        // Create VP
        const vp = await agent.createVerifiablePresentation({
          presentation: {
            holder: identifier.did,
            verifiableCredential,
          },
          proofFormat: 'jwt',
          challenge: query.nonce as string,
          domain: query.client_id as string,
        });

        const idToken = await createJWTProof({
          privateKey: TEST_USER_PRIVATE_KEY,
          audience: query.client_id as string,
          data: {
            sub: identifier.did,
            nonce: query.nonce,
          },
        });

        response = await request(server)
          .post('/authorization-response')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send(
            qs.stringify(
              {
                state: query.state,
                id_token: idToken,
                vp_token: vp,
                presentation_submission: presentationSubmission,
              },
              { encode: true }
            )
          );

        expect(response.status).toBe(200);
        expect.assertions(2);
      });
    });

    /**
     * Fail cases
     */
    describe('Should fail', () => {
      /**
       * Missing state
       */
      it('With missing state', async () => {
        const state = randomUUID();
        let response = await request(server)
          .get('/authorization-request')
          .query({
            credentialType: 'test_presentation_definition_1',
            state,
          })
          .send();

        expect(response.status).toBe(200);

        const query = qs.parse(response.text.replace('openid://?', ''), {
          depth: 50,
          parameterLimit: 1000,
        });

        const agent = await getAgent();

        // Import the did of the test user
        const identifier = await importDid({
          agent,
          privateKey: TEST_USER_PRIVATE_KEY,
          alias: 'testuser',
        });

        const jwtVc =
          'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiR21DcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQifSwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9kaXNjb3h5ei9kaXNjby1zY2hlbWFzL21haW4vanNvbi9HTUNyZWRlbnRpYWwvMS0wLTAuanNvbiIsInR5cGUiOiJKc29uU2NoZW1hVmFsaWRhdG9yMjAxOCJ9fSwic3ViIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQiLCJuYmYiOjE2ODM2MzU2MjcsImlzcyI6ImRpZDpldGhyOjB4MDI4MGE5Y2Q0OGZkNDM2ZjhjMWY4MWIxNTZlYjYxNTYxOGNkNTczYzNlYjFlNmQ5MzdhMTdiODIyMjAyN2NhZTg1In0.D3BzC5d-KqUqtbxHpob3RVom5AmPk34xXqFA2ZOV26VIbQu1vCdWfZfkMfnEpOaztk3lXoab3ImuLgFI4_Lttg';

        const { verifiableCredential } = pex.selectFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          [jwtVc]
        );

        const presentationSubmission = pex.presentationSubmissionFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          verifiableCredential ?? []
        );

        // Create VP
        const vp = await agent.createVerifiablePresentation({
          presentation: {
            holder: identifier.did,
            verifiableCredential,
          },
          proofFormat: 'jwt',
          challenge: query.nonce as string,
          domain: query.client_id as string,
        });

        const idToken = await createJWTProof({
          privateKey: TEST_USER_PRIVATE_KEY,
          audience: query.client_id as string,
          data: {
            sub: identifier.did,
            nonce: query.nonce,
          },
        });

        response = await request(server)
          .post('/authorization-response')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send(
            qs.stringify(
              {
                id_token: idToken,
                vp_token: vp,
                presentation_submission: presentationSubmission,
              },
              { encode: true }
            )
          );

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: 'State is required.',
        });
        expect.assertions(3);
      });

      /**
       * Invalid state
       */
      it('With invalid state', async () => {
        const state = randomUUID();
        let response = await request(server)
          .get('/authorization-request')
          .query({
            credentialType: 'test_presentation_definition_1',
            state,
          })
          .send();

        expect(response.status).toBe(200);

        const query = qs.parse(response.text.replace('openid://?', ''), {
          depth: 50,
          parameterLimit: 1000,
        });

        const agent = await getAgent();

        // Import the did of the test user
        const identifier = await importDid({
          agent,
          privateKey: TEST_USER_PRIVATE_KEY,
          alias: 'testuser',
        });

        const jwtVc =
          'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiR21DcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQifSwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9kaXNjb3h5ei9kaXNjby1zY2hlbWFzL21haW4vanNvbi9HTUNyZWRlbnRpYWwvMS0wLTAuanNvbiIsInR5cGUiOiJKc29uU2NoZW1hVmFsaWRhdG9yMjAxOCJ9fSwic3ViIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQiLCJuYmYiOjE2ODM2MzU2MjcsImlzcyI6ImRpZDpldGhyOjB4MDI4MGE5Y2Q0OGZkNDM2ZjhjMWY4MWIxNTZlYjYxNTYxOGNkNTczYzNlYjFlNmQ5MzdhMTdiODIyMjAyN2NhZTg1In0.D3BzC5d-KqUqtbxHpob3RVom5AmPk34xXqFA2ZOV26VIbQu1vCdWfZfkMfnEpOaztk3lXoab3ImuLgFI4_Lttg';

        const { verifiableCredential } = pex.selectFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          [jwtVc]
        );

        const presentationSubmission = pex.presentationSubmissionFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          verifiableCredential ?? []
        );

        // Create VP
        const vp = await agent.createVerifiablePresentation({
          presentation: {
            holder: identifier.did,
            verifiableCredential,
          },
          proofFormat: 'jwt',
          challenge: query.nonce as string,
          domain: query.client_id as string,
        });

        const idToken = await createJWTProof({
          privateKey: TEST_USER_PRIVATE_KEY,
          audience: query.client_id as string,
          data: {
            sub: identifier.did,
            nonce: query.nonce,
          },
        });

        response = await request(server)
          .post('/authorization-response')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send(
            qs.stringify(
              {
                state: 'invalid_state',
                id_token: idToken,
                vp_token: vp,
                presentation_submission: presentationSubmission,
              },
              { encode: true }
            )
          );

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: 'User session does not exist.',
        });
        expect.assertions(3);
      });

      /**
       * Missing VP challenge
       */
      it('With missing VP challenge', async () => {
        const state = randomUUID();
        let response = await request(server)
          .get('/authorization-request')
          .query({
            credentialType: 'test_presentation_definition_1',
            state,
          })
          .send();

        expect(response.status).toBe(200);

        const query = qs.parse(response.text.replace('openid://?', ''), {
          depth: 50,
          parameterLimit: 1000,
        });

        const agent = await getAgent();

        // Import the did of the test user
        const identifier = await importDid({
          agent,
          privateKey: TEST_USER_PRIVATE_KEY,
          alias: 'testuser',
        });

        const jwtVc =
          'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiR21DcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQifSwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9kaXNjb3h5ei9kaXNjby1zY2hlbWFzL21haW4vanNvbi9HTUNyZWRlbnRpYWwvMS0wLTAuanNvbiIsInR5cGUiOiJKc29uU2NoZW1hVmFsaWRhdG9yMjAxOCJ9fSwic3ViIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQiLCJuYmYiOjE2ODM2MzU2MjcsImlzcyI6ImRpZDpldGhyOjB4MDI4MGE5Y2Q0OGZkNDM2ZjhjMWY4MWIxNTZlYjYxNTYxOGNkNTczYzNlYjFlNmQ5MzdhMTdiODIyMjAyN2NhZTg1In0.D3BzC5d-KqUqtbxHpob3RVom5AmPk34xXqFA2ZOV26VIbQu1vCdWfZfkMfnEpOaztk3lXoab3ImuLgFI4_Lttg';

        const { verifiableCredential } = pex.selectFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          [jwtVc]
        );

        const presentationSubmission = pex.presentationSubmissionFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          verifiableCredential ?? []
        );

        // Create VP
        const vp = await agent.createVerifiablePresentation({
          presentation: {
            holder: identifier.did,
            verifiableCredential: [jwtVc],
          },
          proofFormat: 'jwt',
          domain: query.client_id as string,
        });

        const idToken = await createJWTProof({
          privateKey: TEST_USER_PRIVATE_KEY,
          audience: query.client_id as string,
          data: {
            sub: identifier.did,
            nonce: query.nonce,
          },
        });

        response = await request(server)
          .post('/authorization-response')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send(
            qs.stringify(
              {
                state: query.state,
                id_token: idToken,
                vp_token: vp,
                presentation_submission: presentationSubmission,
              },
              { encode: true }
            )
          );

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: `Invalid vp. Reason: auth_error: Presentation does not contain the mandatory challenge (JWT: nonce) for : ${
            query.nonce as string
          }`,
        });
        expect.assertions(3);
      });

      /**
       * Missing VP domain
       */
      it('With missing VP domain', async () => {
        const state = randomUUID();
        let response = await request(server)
          .get('/authorization-request')
          .query({
            credentialType: 'test_presentation_definition_1',
            state,
          })
          .send();

        expect(response.status).toBe(200);

        const query = qs.parse(response.text.replace('openid://?', ''), {
          depth: 50,
          parameterLimit: 1000,
        });

        const agent = await getAgent();

        // Import the did of the test user
        const identifier = await importDid({
          agent,
          privateKey: TEST_USER_PRIVATE_KEY,
          alias: 'testuser',
        });

        const jwtVc =
          'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiR21DcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQifSwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9kaXNjb3h5ei9kaXNjby1zY2hlbWFzL21haW4vanNvbi9HTUNyZWRlbnRpYWwvMS0wLTAuanNvbiIsInR5cGUiOiJKc29uU2NoZW1hVmFsaWRhdG9yMjAxOCJ9fSwic3ViIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQiLCJuYmYiOjE2ODM2MzU2MjcsImlzcyI6ImRpZDpldGhyOjB4MDI4MGE5Y2Q0OGZkNDM2ZjhjMWY4MWIxNTZlYjYxNTYxOGNkNTczYzNlYjFlNmQ5MzdhMTdiODIyMjAyN2NhZTg1In0.D3BzC5d-KqUqtbxHpob3RVom5AmPk34xXqFA2ZOV26VIbQu1vCdWfZfkMfnEpOaztk3lXoab3ImuLgFI4_Lttg';

        const { verifiableCredential } = pex.selectFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          [jwtVc]
        );

        const presentationSubmission = pex.presentationSubmissionFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          verifiableCredential ?? []
        );

        // Create VP
        const vp = await agent.createVerifiablePresentation({
          presentation: {
            holder: identifier.did,
            verifiableCredential,
          },
          proofFormat: 'jwt',
          challenge: query.nonce as string,
        });

        const idToken = await createJWTProof({
          privateKey: TEST_USER_PRIVATE_KEY,
          audience: query.client_id as string,
          data: {
            sub: identifier.did,
            nonce: query.nonce,
          },
        });

        response = await request(server)
          .post('/authorization-response')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send(
            qs.stringify(
              {
                state: query.state,
                id_token: idToken,
                vp_token: vp,
                presentation_submission: presentationSubmission,
              },
              { encode: true }
            )
          );

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: `Invalid vp. Reason: auth_error: Presentation does not contain the mandatory domain (JWT: aud) for : ${
            query.client_id as string
          }`,
        });
        expect.assertions(3);
      });

      /**
       * Missing VC
       */
      it('With missing VC', async () => {
        const state = randomUUID();
        let response = await request(server)
          .get('/authorization-request')
          .query({
            credentialType: 'test_presentation_definition_1',
            state,
          })
          .send();

        expect(response.status).toBe(200);

        const query = qs.parse(response.text.replace('openid://?', ''), {
          depth: 50,
          parameterLimit: 1000,
        });

        const agent = await getAgent();

        // Import the did of the test user
        const identifier = await importDid({
          agent,
          privateKey: TEST_USER_PRIVATE_KEY,
          alias: 'testuser',
        });

        const jwtVc =
          'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiR21DcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQifSwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9kaXNjb3h5ei9kaXNjby1zY2hlbWFzL21haW4vanNvbi9HTUNyZWRlbnRpYWwvMS0wLTAuanNvbiIsInR5cGUiOiJKc29uU2NoZW1hVmFsaWRhdG9yMjAxOCJ9fSwic3ViIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQiLCJuYmYiOjE2ODM2MzU2MjcsImlzcyI6ImRpZDpldGhyOjB4MDI4MGE5Y2Q0OGZkNDM2ZjhjMWY4MWIxNTZlYjYxNTYxOGNkNTczYzNlYjFlNmQ5MzdhMTdiODIyMjAyN2NhZTg1In0.D3BzC5d-KqUqtbxHpob3RVom5AmPk34xXqFA2ZOV26VIbQu1vCdWfZfkMfnEpOaztk3lXoab3ImuLgFI4_Lttg';

        const { verifiableCredential } = pex.selectFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          [jwtVc]
        );

        const presentationSubmission = pex.presentationSubmissionFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          verifiableCredential ?? []
        );

        // Create VP
        const vp = await agent.createVerifiablePresentation({
          presentation: {
            holder: identifier.did,
            verifiableCredential: [],
          },
          proofFormat: 'jwt',
          challenge: query.nonce as string,
          domain: query.client_id as string,
        });

        const idToken = await createJWTProof({
          privateKey: TEST_USER_PRIVATE_KEY,
          audience: query.client_id as string,
          data: {
            sub: identifier.did,
            nonce: query.nonce,
          },
        });

        response = await request(server)
          .post('/authorization-response')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send(
            qs.stringify(
              {
                state: query.state,
                id_token: idToken,
                vp_token: vp,
                presentation_submission: presentationSubmission,
              },
              { encode: true }
            )
          );

        expect(response.status).toBe(500);
        expect(response.body).toStrictEqual({
          error: 'internal_server_error',
          error_description:
            'Unexpected error occured while verifying vp_token',
        });
        expect.assertions(3);
      });

      /**
       * Missing vp_token
       */
      it('With missing vp_token', async () => {
        const state = randomUUID();
        let response = await request(server)
          .get('/authorization-request')
          .query({
            credentialType: 'test_presentation_definition_1',
            state,
          })
          .send();

        expect(response.status).toBe(200);

        const query = qs.parse(response.text.replace('openid://?', ''), {
          depth: 50,
          parameterLimit: 1000,
        });

        const agent = await getAgent();

        // Import the did of the test user
        const identifier = await importDid({
          agent,
          privateKey: TEST_USER_PRIVATE_KEY,
          alias: 'testuser',
        });

        const jwtVc =
          'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiR21DcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQifSwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9kaXNjb3h5ei9kaXNjby1zY2hlbWFzL21haW4vanNvbi9HTUNyZWRlbnRpYWwvMS0wLTAuanNvbiIsInR5cGUiOiJKc29uU2NoZW1hVmFsaWRhdG9yMjAxOCJ9fSwic3ViIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQiLCJuYmYiOjE2ODM2MzU2MjcsImlzcyI6ImRpZDpldGhyOjB4MDI4MGE5Y2Q0OGZkNDM2ZjhjMWY4MWIxNTZlYjYxNTYxOGNkNTczYzNlYjFlNmQ5MzdhMTdiODIyMjAyN2NhZTg1In0.D3BzC5d-KqUqtbxHpob3RVom5AmPk34xXqFA2ZOV26VIbQu1vCdWfZfkMfnEpOaztk3lXoab3ImuLgFI4_Lttg';

        const { verifiableCredential } = pex.selectFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          [jwtVc]
        );

        const presentationSubmission = pex.presentationSubmissionFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          verifiableCredential ?? []
        );

        const idToken = await createJWTProof({
          privateKey: TEST_USER_PRIVATE_KEY,
          audience: query.client_id as string,
          data: {
            sub: identifier.did,
            nonce: query.nonce,
          },
        });

        response = await request(server)
          .post('/authorization-response')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send(
            qs.stringify(
              {
                state: query.state,
                id_token: idToken,
                presentation_submission: presentationSubmission,
              },
              { encode: true }
            )
          );

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: 'vp_token must be present',
        });
        expect.assertions(3);
      });

      /**
       * Missing presentation submission
       */
      it('With missing presentation submission', async () => {
        const state = randomUUID();
        let response = await request(server)
          .get('/authorization-request')
          .query({
            credentialType: 'test_presentation_definition_1',
            state,
          })
          .send();

        expect(response.status).toBe(200);

        const query = qs.parse(response.text.replace('openid://?', ''), {
          depth: 50,
          parameterLimit: 1000,
        });

        const agent = await getAgent();

        // Import the did of the test user
        const identifier = await importDid({
          agent,
          privateKey: TEST_USER_PRIVATE_KEY,
          alias: 'testuser',
        });

        const jwtVc =
          'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiR21DcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQifSwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9kaXNjb3h5ei9kaXNjby1zY2hlbWFzL21haW4vanNvbi9HTUNyZWRlbnRpYWwvMS0wLTAuanNvbiIsInR5cGUiOiJKc29uU2NoZW1hVmFsaWRhdG9yMjAxOCJ9fSwic3ViIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQiLCJuYmYiOjE2ODM2MzU2MjcsImlzcyI6ImRpZDpldGhyOjB4MDI4MGE5Y2Q0OGZkNDM2ZjhjMWY4MWIxNTZlYjYxNTYxOGNkNTczYzNlYjFlNmQ5MzdhMTdiODIyMjAyN2NhZTg1In0.D3BzC5d-KqUqtbxHpob3RVom5AmPk34xXqFA2ZOV26VIbQu1vCdWfZfkMfnEpOaztk3lXoab3ImuLgFI4_Lttg';

        const { verifiableCredential } = pex.selectFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          [jwtVc]
        );

        // Create VP
        const vp = await agent.createVerifiablePresentation({
          presentation: {
            holder: identifier.did,
            verifiableCredential,
          },
          proofFormat: 'jwt',
          challenge: query.nonce as string,
          domain: query.client_id as string,
        });

        const idToken = await createJWTProof({
          privateKey: TEST_USER_PRIVATE_KEY,
          audience: query.client_id as string,
          data: {
            sub: identifier.did,
            nonce: query.nonce,
          },
        });

        response = await request(server)
          .post('/authorization-response')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send(
            qs.stringify(
              {
                state: query.state,
                id_token: idToken,
                vp_token: vp,
              },
              { encode: true }
            )
          );

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: 'presentation_submission must be present',
        });
        expect.assertions(3);
      });

      it('With invalid VC', async () => {});

      it.todo('With invalid presentation submission - wrong path');
      it.todo('With invalid presentation submission - missing id');
      it.todo(
        'With invalid presentation submission - missing descriptor_map id'
      );

      /**
       * Invalid presentation submission definition_id - doesn't match the presentation_definition.id
       */
      it('With invalid presentation submission - invalid definition_id', async () => {
        const state = randomUUID();
        let response = await request(server)
          .get('/authorization-request')
          .query({
            credentialType: 'test_presentation_definition_1',
            state,
          })
          .send();

        expect(response.status).toBe(200);

        const query = qs.parse(response.text.replace('openid://?', ''), {
          depth: 50,
          parameterLimit: 1000,
        });

        const agent = await getAgent();

        // Import the did of the test user
        const identifier = await importDid({
          agent,
          privateKey: TEST_USER_PRIVATE_KEY,
          alias: 'testuser',
        });

        const jwtVc =
          'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiR21DcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQifSwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9kaXNjb3h5ei9kaXNjby1zY2hlbWFzL21haW4vanNvbi9HTUNyZWRlbnRpYWwvMS0wLTAuanNvbiIsInR5cGUiOiJKc29uU2NoZW1hVmFsaWRhdG9yMjAxOCJ9fSwic3ViIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQiLCJuYmYiOjE2ODM2MzU2MjcsImlzcyI6ImRpZDpldGhyOjB4MDI4MGE5Y2Q0OGZkNDM2ZjhjMWY4MWIxNTZlYjYxNTYxOGNkNTczYzNlYjFlNmQ5MzdhMTdiODIyMjAyN2NhZTg1In0.D3BzC5d-KqUqtbxHpob3RVom5AmPk34xXqFA2ZOV26VIbQu1vCdWfZfkMfnEpOaztk3lXoab3ImuLgFI4_Lttg';

        const { verifiableCredential } = pex.selectFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          [jwtVc]
        );

        const presentationSubmission = pex.presentationSubmissionFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          verifiableCredential ?? []
        );

        presentationSubmission.definition_id = 'invalid_definition_id';

        // Create VP
        const vp = await agent.createVerifiablePresentation({
          presentation: {
            holder: identifier.did,
            verifiableCredential: [jwtVc],
          },
          proofFormat: 'jwt',
          challenge: query.nonce as string,
          domain: query.client_id as string,
        });

        const idToken = await createJWTProof({
          privateKey: TEST_USER_PRIVATE_KEY,
          audience: query.client_id as string,
          data: {
            sub: identifier.did,
            nonce: query.nonce,
          },
        });

        response = await request(server)
          .post('/authorization-response')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send(
            qs.stringify(
              {
                state: query.state,
                id_token: idToken,
                vp_token: vp,
                presentation_submission: presentationSubmission,
              },
              { encode: true }
            )
          );

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description:
            'presentation_submission definition_id does not match presentation_definition id',
        });
        expect.assertions(3);
      });

      /**
       * Invalid presentation submission descriptor_map - empty
       */
      it('With invalid presentation submission - empty descriptor map', async () => {
        const state = randomUUID();
        let response = await request(server)
          .get('/authorization-request')
          .query({
            credentialType: 'test_presentation_definition_1',
            state,
          })
          .send();

        expect(response.status).toBe(200);

        const query = qs.parse(response.text.replace('openid://?', ''), {
          depth: 50,
          parameterLimit: 1000,
        });

        const agent = await getAgent();

        // Import the did of the test user
        const identifier = await importDid({
          agent,
          privateKey: TEST_USER_PRIVATE_KEY,
          alias: 'testuser',
        });

        const jwtVc =
          'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiR21DcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQifSwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9kaXNjb3h5ei9kaXNjby1zY2hlbWFzL21haW4vanNvbi9HTUNyZWRlbnRpYWwvMS0wLTAuanNvbiIsInR5cGUiOiJKc29uU2NoZW1hVmFsaWRhdG9yMjAxOCJ9fSwic3ViIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQiLCJuYmYiOjE2ODM2MzU2MjcsImlzcyI6ImRpZDpldGhyOjB4MDI4MGE5Y2Q0OGZkNDM2ZjhjMWY4MWIxNTZlYjYxNTYxOGNkNTczYzNlYjFlNmQ5MzdhMTdiODIyMjAyN2NhZTg1In0.D3BzC5d-KqUqtbxHpob3RVom5AmPk34xXqFA2ZOV26VIbQu1vCdWfZfkMfnEpOaztk3lXoab3ImuLgFI4_Lttg';

        const { verifiableCredential } = pex.selectFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          [jwtVc]
        );

        const presentationSubmission = pex.presentationSubmissionFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          verifiableCredential ?? []
        );

        (presentationSubmission as any).descriptor_map = [];

        // Create VP
        const vp = await agent.createVerifiablePresentation({
          presentation: {
            holder: identifier.did,
            verifiableCredential: [jwtVc],
          },
          proofFormat: 'jwt',
          challenge: query.nonce as string,
          domain: query.client_id as string,
        });

        const idToken = await createJWTProof({
          privateKey: TEST_USER_PRIVATE_KEY,
          audience: query.client_id as string,
          data: {
            sub: identifier.did,
            nonce: query.nonce,
          },
        });

        response = await request(server)
          .post('/authorization-response')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send(
            qs.stringify(
              {
                state: query.state,
                id_token: idToken,
                vp_token: vp,
                presentation_submission: presentationSubmission,
              },
              { encode: true }
            )
          );

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description:
            'presentation_submission descriptor_map must be an array with at least one element',
        });
        expect.assertions(3);
      });

      it.todo('With invalid VP format');
      it.todo('With invalid VC format');

      /**
       * Invalid VP challenge
       */
      it('With invalid VP challenge', async () => {
        const state = randomUUID();
        let response = await request(server)
          .get('/authorization-request')
          .query({
            credentialType: 'test_presentation_definition_1',
            state,
          })
          .send();

        expect(response.status).toBe(200);

        const query = qs.parse(response.text.replace('openid://?', ''), {
          depth: 50,
          parameterLimit: 1000,
        });

        const agent = await getAgent();

        // Import the did of the test user
        const identifier = await importDid({
          agent,
          privateKey: TEST_USER_PRIVATE_KEY,
          alias: 'testuser',
        });

        const jwtVc =
          'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiR21DcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQifSwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9kaXNjb3h5ei9kaXNjby1zY2hlbWFzL21haW4vanNvbi9HTUNyZWRlbnRpYWwvMS0wLTAuanNvbiIsInR5cGUiOiJKc29uU2NoZW1hVmFsaWRhdG9yMjAxOCJ9fSwic3ViIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQiLCJuYmYiOjE2ODM2MzU2MjcsImlzcyI6ImRpZDpldGhyOjB4MDI4MGE5Y2Q0OGZkNDM2ZjhjMWY4MWIxNTZlYjYxNTYxOGNkNTczYzNlYjFlNmQ5MzdhMTdiODIyMjAyN2NhZTg1In0.D3BzC5d-KqUqtbxHpob3RVom5AmPk34xXqFA2ZOV26VIbQu1vCdWfZfkMfnEpOaztk3lXoab3ImuLgFI4_Lttg';

        const { verifiableCredential } = pex.selectFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          [jwtVc]
        );

        const presentationSubmission = pex.presentationSubmissionFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          verifiableCredential ?? []
        );

        // Create VP
        const vp = await agent.createVerifiablePresentation({
          presentation: {
            holder: identifier.did,
            verifiableCredential: [jwtVc],
          },
          proofFormat: 'jwt',
          domain: query.client_id as string,
          challenge: 'invalid-challenge',
        });

        const idToken = await createJWTProof({
          privateKey: TEST_USER_PRIVATE_KEY,
          audience: query.client_id as string,
          data: {
            sub: identifier.did,
            nonce: query.nonce,
          },
        });

        response = await request(server)
          .post('/authorization-response')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send(
            qs.stringify(
              {
                state: query.state,
                id_token: idToken,
                vp_token: vp,
                presentation_submission: presentationSubmission,
              },
              { encode: true }
            )
          );

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: `Invalid vp. Reason: auth_error: Presentation does not contain the mandatory challenge (JWT: nonce) for : ${
            query.nonce as string
          }`,
        });
        expect.assertions(3);
      });

      /**
       * Invalid VP domain
       */
      it('With invalid VP domain', async () => {
        const state = randomUUID();
        let response = await request(server)
          .get('/authorization-request')
          .query({
            credentialType: 'test_presentation_definition_1',
            state,
          })
          .send();

        expect(response.status).toBe(200);

        const query = qs.parse(response.text.replace('openid://?', ''), {
          depth: 50,
          parameterLimit: 1000,
        });

        const agent = await getAgent();

        // Import the did of the test user
        const identifier = await importDid({
          agent,
          privateKey: TEST_USER_PRIVATE_KEY,
          alias: 'testuser',
        });

        const jwtVc =
          'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiR21DcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQifSwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9kaXNjb3h5ei9kaXNjby1zY2hlbWFzL21haW4vanNvbi9HTUNyZWRlbnRpYWwvMS0wLTAuanNvbiIsInR5cGUiOiJKc29uU2NoZW1hVmFsaWRhdG9yMjAxOCJ9fSwic3ViIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQiLCJuYmYiOjE2ODM2MzU2MjcsImlzcyI6ImRpZDpldGhyOjB4MDI4MGE5Y2Q0OGZkNDM2ZjhjMWY4MWIxNTZlYjYxNTYxOGNkNTczYzNlYjFlNmQ5MzdhMTdiODIyMjAyN2NhZTg1In0.D3BzC5d-KqUqtbxHpob3RVom5AmPk34xXqFA2ZOV26VIbQu1vCdWfZfkMfnEpOaztk3lXoab3ImuLgFI4_Lttg';

        const { verifiableCredential } = pex.selectFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          [jwtVc]
        );

        const presentationSubmission = pex.presentationSubmissionFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          verifiableCredential ?? []
        );

        // Create VP
        const vp = await agent.createVerifiablePresentation({
          presentation: {
            holder: identifier.did,
            verifiableCredential: [jwtVc],
          },
          proofFormat: 'jwt',
          domain: 'invalid-domain',
          challenge: query.nonce as string,
        });

        const idToken = await createJWTProof({
          privateKey: TEST_USER_PRIVATE_KEY,
          audience: query.client_id as string,
          data: {
            sub: identifier.did,
            nonce: query.nonce,
          },
        });

        response = await request(server)
          .post('/authorization-response')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send(
            qs.stringify(
              {
                state: query.state,
                id_token: idToken,
                vp_token: vp,
                presentation_submission: presentationSubmission,
              },
              { encode: true }
            )
          );

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: `Invalid vp. Reason: invalid_config: JWT audience does not match your DID or callback url`,
        });
        expect.assertions(3);
      });

      it.todo('With invalid did method in VC');

      /**
       * With unsupported did method in VP
       */
      it.skip('With unsupported did method in VP', async () => {
        const state = randomUUID();
        let response = await request(server)
          .get('/authorization-request')
          .query({
            credentialType: 'test_presentation_definition_1',
            state,
          })
          .send();

        expect(response.status).toBe(200);

        const query = qs.parse(response.text.replace('openid://?', ''), {
          depth: 50,
          parameterLimit: 1000,
        });

        const agent = await getAgent();

        // Import the did of the test user
        const identifier = await importDid({
          agent,
          privateKey: TEST_USER_PRIVATE_KEY,
          alias: 'testuser',
          options: {
            did: 'did:key:zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik',
            provider: 'did:key',
          },
        });

        const jwtVc =
          'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiR21DcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQifSwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9kaXNjb3h5ei9kaXNjby1zY2hlbWFzL21haW4vanNvbi9HTUNyZWRlbnRpYWwvMS0wLTAuanNvbiIsInR5cGUiOiJKc29uU2NoZW1hVmFsaWRhdG9yMjAxOCJ9fSwic3ViIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQiLCJuYmYiOjE2ODM2MzU2MjcsImlzcyI6ImRpZDpldGhyOjB4MDI4MGE5Y2Q0OGZkNDM2ZjhjMWY4MWIxNTZlYjYxNTYxOGNkNTczYzNlYjFlNmQ5MzdhMTdiODIyMjAyN2NhZTg1In0.D3BzC5d-KqUqtbxHpob3RVom5AmPk34xXqFA2ZOV26VIbQu1vCdWfZfkMfnEpOaztk3lXoab3ImuLgFI4_Lttg';

        const { verifiableCredential } = pex.selectFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          [jwtVc]
        );

        const presentationSubmission = pex.presentationSubmissionFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          verifiableCredential ?? []
        );

        // Create VP
        const vp = await agent.createVerifiablePresentation({
          presentation: {
            holder: identifier.did,
            verifiableCredential,
          },
          proofFormat: 'jwt',
          challenge: query.nonce as string,
          domain: query.client_id as string,
        });

        const idToken = await createJWTProof({
          privateKey: TEST_USER_PRIVATE_KEY,
          audience: query.client_id as string,
          data: {
            sub: identifier.did,
            nonce: query.nonce,
          },
          options: {
            did: identifier.did,
            kid: 'did:key:zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik#zQ3shW537fJMvkiw69S1FLvBaE8pyzAx4agHu6iaYzTCejuik',
          },
        });

        response = await request(server)
          .post('/authorization-response')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send(
            qs.stringify(
              {
                state: query.state,
                id_token: idToken,
                vp_token: vp,
                presentation_submission: presentationSubmission,
              },
              { encode: true }
            )
          );

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description:
            "The presentation you've sent didn't satisfy the requirement defined presentationDefinition object.",
        });
        expect.assertions(3);
      });

      /**
       * Invalid id_token - iss and sub do not match
       */
      it('With invalid id_token - iss and sub do not match', async () => {
        const state = randomUUID();
        let response = await request(server)
          .get('/authorization-request')
          .query({
            credentialType: 'test_presentation_definition_1',
            state,
          })
          .send();

        expect(response.status).toBe(200);

        const query = qs.parse(response.text.replace('openid://?', ''), {
          depth: 50,
          parameterLimit: 1000,
        });

        const agent = await getAgent();

        // Import the did of the test user
        const identifier = await importDid({
          agent,
          privateKey: TEST_USER_PRIVATE_KEY,
          alias: 'testuser',
        });

        const jwtVc =
          'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiR21DcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQifSwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9kaXNjb3h5ei9kaXNjby1zY2hlbWFzL21haW4vanNvbi9HTUNyZWRlbnRpYWwvMS0wLTAuanNvbiIsInR5cGUiOiJKc29uU2NoZW1hVmFsaWRhdG9yMjAxOCJ9fSwic3ViIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQiLCJuYmYiOjE2ODM2MzU2MjcsImlzcyI6ImRpZDpldGhyOjB4MDI4MGE5Y2Q0OGZkNDM2ZjhjMWY4MWIxNTZlYjYxNTYxOGNkNTczYzNlYjFlNmQ5MzdhMTdiODIyMjAyN2NhZTg1In0.D3BzC5d-KqUqtbxHpob3RVom5AmPk34xXqFA2ZOV26VIbQu1vCdWfZfkMfnEpOaztk3lXoab3ImuLgFI4_Lttg';

        const { verifiableCredential } = pex.selectFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          [jwtVc]
        );

        const presentationSubmission = pex.presentationSubmissionFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          verifiableCredential ?? []
        );

        // Create VP
        const vp = await agent.createVerifiablePresentation({
          presentation: {
            holder: identifier.did,
            verifiableCredential,
          },
          proofFormat: 'jwt',
          challenge: query.nonce as string,
          domain: query.client_id as string,
        });

        const idToken = await createJWTProof({
          privateKey: TEST_USER_PRIVATE_KEY,
          audience: query.client_id as string,
          data: {
            sub: 'random-subject',
            nonce: query.nonce,
          },
        });

        response = await request(server)
          .post('/authorization-response')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send(
            qs.stringify(
              {
                state: query.state,
                id_token: idToken,
                vp_token: vp,
                presentation_submission: presentationSubmission,
              },
              { encode: true }
            )
          );

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: 'id_token iss and sub must be equal',
        });

        expect.assertions(3);
      });

      /**
       * Invalid id_token - expired
       */
      it('With invalid id_token - expired', async () => {
        const state = randomUUID();
        let response = await request(server)
          .get('/authorization-request')
          .query({
            credentialType: 'test_presentation_definition_1',
            state,
          })
          .send();

        expect(response.status).toBe(200);

        const query = qs.parse(response.text.replace('openid://?', ''), {
          depth: 50,
          parameterLimit: 1000,
        });

        const agent = await getAgent();

        // Import the did of the test user
        const identifier = await importDid({
          agent,
          privateKey: TEST_USER_PRIVATE_KEY,
          alias: 'testuser',
        });

        const jwtVc =
          'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiR21DcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQifSwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9kaXNjb3h5ei9kaXNjby1zY2hlbWFzL21haW4vanNvbi9HTUNyZWRlbnRpYWwvMS0wLTAuanNvbiIsInR5cGUiOiJKc29uU2NoZW1hVmFsaWRhdG9yMjAxOCJ9fSwic3ViIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQiLCJuYmYiOjE2ODM2MzU2MjcsImlzcyI6ImRpZDpldGhyOjB4MDI4MGE5Y2Q0OGZkNDM2ZjhjMWY4MWIxNTZlYjYxNTYxOGNkNTczYzNlYjFlNmQ5MzdhMTdiODIyMjAyN2NhZTg1In0.D3BzC5d-KqUqtbxHpob3RVom5AmPk34xXqFA2ZOV26VIbQu1vCdWfZfkMfnEpOaztk3lXoab3ImuLgFI4_Lttg';

        const { verifiableCredential } = pex.selectFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          [jwtVc]
        );

        const presentationSubmission = pex.presentationSubmissionFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          verifiableCredential ?? []
        );

        // Create VP
        const vp = await agent.createVerifiablePresentation({
          presentation: {
            holder: identifier.did,
            verifiableCredential,
          },
          proofFormat: 'jwt',
          challenge: query.nonce as string,
          domain: query.client_id as string,
        });

        const idToken = await createJWTProof({
          privateKey: TEST_USER_PRIVATE_KEY,
          audience: query.client_id as string,
          data: {
            sub: identifier.did,
            nonce: query.nonce,
            exp: Date.now() / 1000 - 1000,
          },
        });

        response = await request(server)
          .post('/authorization-response')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send(
            qs.stringify(
              {
                state: query.state,
                id_token: idToken,
                vp_token: vp,
                presentation_submission: presentationSubmission,
              },
              { encode: true }
            )
          );

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: 'id_token expired',
        });

        expect.assertions(3);
      });

      /**
       * Invalid id_token - not yet valid
       */
      it('With invalid id_token - not yet valid', async () => {
        const state = randomUUID();
        let response = await request(server)
          .get('/authorization-request')
          .query({
            credentialType: 'test_presentation_definition_1',
            state,
          })
          .send();

        expect(response.status).toBe(200);

        const query = qs.parse(response.text.replace('openid://?', ''), {
          depth: 50,
          parameterLimit: 1000,
        });

        const agent = await getAgent();

        // Import the did of the test user
        const identifier = await importDid({
          agent,
          privateKey: TEST_USER_PRIVATE_KEY,
          alias: 'testuser',
        });

        const jwtVc =
          'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiR21DcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQifSwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9kaXNjb3h5ei9kaXNjby1zY2hlbWFzL21haW4vanNvbi9HTUNyZWRlbnRpYWwvMS0wLTAuanNvbiIsInR5cGUiOiJKc29uU2NoZW1hVmFsaWRhdG9yMjAxOCJ9fSwic3ViIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQiLCJuYmYiOjE2ODM2MzU2MjcsImlzcyI6ImRpZDpldGhyOjB4MDI4MGE5Y2Q0OGZkNDM2ZjhjMWY4MWIxNTZlYjYxNTYxOGNkNTczYzNlYjFlNmQ5MzdhMTdiODIyMjAyN2NhZTg1In0.D3BzC5d-KqUqtbxHpob3RVom5AmPk34xXqFA2ZOV26VIbQu1vCdWfZfkMfnEpOaztk3lXoab3ImuLgFI4_Lttg';

        const { verifiableCredential } = pex.selectFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          [jwtVc]
        );

        const presentationSubmission = pex.presentationSubmissionFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          verifiableCredential ?? []
        );

        // Create VP
        const vp = await agent.createVerifiablePresentation({
          presentation: {
            holder: identifier.did,
            verifiableCredential,
          },
          proofFormat: 'jwt',
          challenge: query.nonce as string,
          domain: query.client_id as string,
        });

        const idToken = await createJWTProof({
          privateKey: TEST_USER_PRIVATE_KEY,
          audience: query.client_id as string,
          data: {
            sub: identifier.did,
            nonce: query.nonce,
            nbf: Date.now() / 1000 + 10000,
          },
        });

        response = await request(server)
          .post('/authorization-response')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send(
            qs.stringify(
              {
                state: query.state,
                id_token: idToken,
                vp_token: vp,
                presentation_submission: presentationSubmission,
              },
              { encode: true }
            )
          );

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: 'id_token not valid yet',
        });

        expect.assertions(3);
      });

      /**
       * Invalid id_token - invalid nonce
       */
      it('With invalid id_token - invalid nonce', async () => {
        const state = randomUUID();
        let response = await request(server)
          .get('/authorization-request')
          .query({
            credentialType: 'test_presentation_definition_1',
            state,
          })
          .send();

        expect(response.status).toBe(200);

        const query = qs.parse(response.text.replace('openid://?', ''), {
          depth: 50,
          parameterLimit: 1000,
        });

        const agent = await getAgent();

        // Import the did of the test user
        const identifier = await importDid({
          agent,
          privateKey: TEST_USER_PRIVATE_KEY,
          alias: 'testuser',
        });

        const jwtVc =
          'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiR21DcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQifSwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9kaXNjb3h5ei9kaXNjby1zY2hlbWFzL21haW4vanNvbi9HTUNyZWRlbnRpYWwvMS0wLTAuanNvbiIsInR5cGUiOiJKc29uU2NoZW1hVmFsaWRhdG9yMjAxOCJ9fSwic3ViIjoiZGlkOmV0aHI6MHgwM2ZkNGZhYzI1ZjQ3YmU1Y2ZmMDY2OTJmNDM2N2ZlZGRhZTk2MjY0N2NiZjkzNGE5MjNkMDUxNzNiZGRjNDJmNWQiLCJuYmYiOjE2ODM2MzU2MjcsImlzcyI6ImRpZDpldGhyOjB4MDI4MGE5Y2Q0OGZkNDM2ZjhjMWY4MWIxNTZlYjYxNTYxOGNkNTczYzNlYjFlNmQ5MzdhMTdiODIyMjAyN2NhZTg1In0.D3BzC5d-KqUqtbxHpob3RVom5AmPk34xXqFA2ZOV26VIbQu1vCdWfZfkMfnEpOaztk3lXoab3ImuLgFI4_Lttg';

        const { verifiableCredential } = pex.selectFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          [jwtVc]
        );

        const presentationSubmission = pex.presentationSubmissionFrom(
          query.presentation_definition as unknown as PresentationDefinition,
          verifiableCredential ?? []
        );

        // Create VP
        const vp = await agent.createVerifiablePresentation({
          presentation: {
            holder: identifier.did,
            verifiableCredential,
          },
          proofFormat: 'jwt',
          challenge: query.nonce as string,
          domain: query.client_id as string,
        });

        const idToken = await createJWTProof({
          privateKey: TEST_USER_PRIVATE_KEY,
          audience: query.client_id as string,
          data: {
            sub: identifier.did,
            nonce: 'invalid-nonce',
          },
        });

        response = await request(server)
          .post('/authorization-response')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send(
            qs.stringify(
              {
                state: query.state,
                id_token: idToken,
                vp_token: vp,
                presentation_submission: presentationSubmission,
              },
              { encode: true }
            )
          );

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'invalid_request',
          error_description: 'Invalid nonce',
        });

        expect.assertions(3);
      });
    });
  });
});
