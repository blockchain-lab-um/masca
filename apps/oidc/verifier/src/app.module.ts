import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import ConfigModule from './config/configuration';

@Module({
  imports: [ConfigModule],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
export default AppModule;
