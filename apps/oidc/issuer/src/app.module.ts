import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import ConfigModule from './config/configuration';
import { AgentService } from './modules/agent/agent.service';
import { DatastoreService } from './modules/datastore/datastore.service';

@Module({
  imports: [ConfigModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [ConfigService, AppService, AgentService, DatastoreService],
})
export class AppModule {}
export default AppModule;
