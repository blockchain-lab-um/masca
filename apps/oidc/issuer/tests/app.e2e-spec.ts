import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

import { FastifyInstance } from 'fastify';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>();

    await app.init();
    await (app.getHttpAdapter().getInstance() as FastifyInstance).ready();
  });
});
