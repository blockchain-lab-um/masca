import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { AgentService } from './modules/agent/agent.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  await app.get<AgentService>(AgentService).initializeAgent();

  await app.listen(3003, '0.0.0.0');
}
bootstrap()
  .then(() => {})
  .catch((e) => {
    throw e;
  });
