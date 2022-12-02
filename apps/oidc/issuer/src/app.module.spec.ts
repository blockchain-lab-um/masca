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
import { TokenRequest } from '@blockchain-lab-um/oidc-types';
import { AppModule } from './app.module';
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

        console.log(query);
        console.log(query['pre-authorized_code']);

        expect(response.status).toBe(200);

        const tokenRequestData: TokenRequest = {
          grant_type: 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
          'pre-authorized_code': query['pre-authorized_code'] as string,
        };

        response = await request(server).post('/token').send(tokenRequestData);

        expect(response.status).toBe(200);

        expect.assertions(2);
      });

      it('With authorization_code', async () => {});

      it('With pre-authorization_code and user_pin', async () => {});
    });

    describe('Should fail', () => {
      it('With invalid pre-authorized_code', async () => {});
    });
  });

  describe('[POST]: /credential', () => {
    describe('Should succeed', () => {
      it('todo', () => {});
    });

    describe('Should fail', () => {
      it('todo', () => {});
    });
  });
});
