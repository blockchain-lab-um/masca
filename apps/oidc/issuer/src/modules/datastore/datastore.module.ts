import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatastoreService } from './datastore.service.js';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [DatastoreService],
  exports: [DatastoreService],
})
export class DatastoreModule {}

export default DatastoreModule;
