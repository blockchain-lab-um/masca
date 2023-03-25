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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, global-require, @typescript-eslint/no-var-requires
  await fastifyAdapter.register(require('@fastify/formbody'), {
    parser: (str: string) => {
      return qs.parse(str, {
        // Parse up to 50 children deep
        depth: 50,
        // Parse up to 1000 parameters
        parameterLimit: 1000,
      });
    },
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
