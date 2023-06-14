import { fastifyFormbody } from '@fastify/formbody';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import qs from 'qs';

import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './filters/all-exceptions.filter.js';
import { AgentService } from './modules/agent/agent.service.js';

async function bootstrap() {
  // Create fastify adapter and enable CORS
  const fastifyAdapter = new FastifyAdapter();
  fastifyAdapter.enableCors({ methods: '*', origin: '*' });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  await fastifyAdapter.register(fastifyFormbody, {
    parser: (str: string) =>
      qs.parse(str, {
        depth: 50,
        parameterLimit: 1000,
      }),
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    { bodyParser: false }
  );

  // Set up the global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Initialize the agent
  await app.get<AgentService>(AgentService).initializeAgent();

  await app.listen(3003, '0.0.0.0');
}
bootstrap()
  .then(() => {})
  .catch((e) => {
    throw e;
  });
