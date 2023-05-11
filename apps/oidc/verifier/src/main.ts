import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import qs from 'qs';

import { AppModule } from './app.module.js';
import AllExceptionsFilter from './filters/all-exceptions.filter.js';

async function bootstrap() {
  // Create fastify adapter and enable CORS
  const fastifyAdapter = new FastifyAdapter();
  fastifyAdapter.enableCors({ methods: '*', origin: '*' });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, global-require, @typescript-eslint/no-var-requires
  await fastifyAdapter.register(require('@fastify/formbody'), {
    parser: (str: string) => {
      return qs.parse(str, {
        depth: 50,
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

  await app.listen(3004, '0.0.0.0');
}

bootstrap()
  .then(() => {})
  .catch((e) => {
    throw e;
  });
