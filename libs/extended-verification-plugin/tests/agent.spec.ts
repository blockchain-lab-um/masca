import * as fs from 'fs';
import {
  createAgent,
  type IAgentOptions,
  type ICredentialPlugin,
  type IDataStore,
  type IDataStoreORM,
  type IDIDManager,
  type IKeyManager,
  type IResolver,
  type TAgent,
} from '@veramo/core';
import { Entities, migrations } from '@veramo/data-store';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { describe } from 'vitest';

import plugin from './plugin';

const KMS_SECRET_KEY =
  '29739248cad1bd1a0fc4d9b75cd4d2990de535baf5caadfdf8d8f86664aa830c';

let agent: TAgent<
  IDIDManager &
    IKeyManager &
    IDataStore &
    IDataStoreORM &
    IResolver &
    ICredentialPlugin
>;
let dbConnection: DataSource;
let databaseFile: string;

const setup = async (options?: IAgentOptions): Promise<boolean> => {
  databaseFile = options?.context?.databaseFile || ':memory:';
  dbConnection = await new DataSource({
    name: options?.context?.dbName || 'test',
    type: 'better-sqlite3',
    database: databaseFile,
    synchronize: false,
    migrations,
    migrationsRun: true,
    logging: false,
    entities: Entities,
    ...options?.context?.dbConnectionOptions,
  } as DataSourceOptions).initialize();

  agent = createAgent<
    IDIDManager &
      IKeyManager &
      IDataStore &
      IDataStoreORM &
      IResolver &
      ICredentialPlugin
  >({
    plugins: [],
  });
  return true;
};

const tearDown = async (): Promise<boolean> => {
  try {
    await dbConnection.dropDatabase();
    await dbConnection.destroy();
  } catch (e) {
    // nop
  }
  try {
    fs.unlinkSync(databaseFile);
  } catch (e) {
    // nop
  }
  return true;
};

const getAgent = () => agent;

const testContext = { getAgent, setup, tearDown };

describe('Extendted verification plugin tests', () => {
  plugin(testContext);
});
