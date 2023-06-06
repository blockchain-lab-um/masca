import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { DatastoreService } from './datastore.service.js';

@Module({
  imports: [ConfigModule, ScheduleModule.forRoot()],
  controllers: [],
  providers: [DatastoreService],
  exports: [DatastoreService],
})
export class DatastoreModule {}

export default DatastoreModule;
