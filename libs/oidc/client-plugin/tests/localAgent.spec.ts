// import fs from 'fs';

// Shared tests
import { describe } from 'vitest';

import myPluginLogic, { type ConfiguredAgent } from './shared/integration.js';

// let dbConnection: any;
let agent: ConfiguredAgent;

const setup = async (): Promise<boolean> => true;

const tearDown = async (): Promise<boolean> =>
  // fs.unlinkSync('./database.sqlite');
  true;

const getAgent = () => agent;

const testContext = { getAgent, setup, tearDown };

describe('Local integration tests', () => {
  myPluginLogic(testContext);
});
