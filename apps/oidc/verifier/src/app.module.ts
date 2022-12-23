import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AgentService } from './modules/agent/agent.service';

import ConfigModule from './config/configuration';

@Module({
  imports: [ConfigModule],
  controllers: [AppController],
  providers: [ConfigService, AppService, AgentService],
})
export class AppModule {}
export default AppModule;
