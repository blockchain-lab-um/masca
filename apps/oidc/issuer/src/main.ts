import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './filters/all-exceptions.filter.js';
import { AgentService } from './modules/agent/agent.service.js';

async function bootstrap() {
  // Create fastify adapter and enable CORS
  const fastifyAdapter = new FastifyAdapter();
  fastifyAdapter.enableCors({ methods: '*' });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter
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
