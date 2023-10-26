import { TAgent } from '@veramo/core';
import { afterAll, beforeAll, describe, it } from 'vitest';

import { IOIDCClientPlugin } from '../../src/types/IOIDCClientPlugin.js';

export type ConfiguredAgent = TAgent<IOIDCClientPlugin>;

export default (testContext: {
  getAgent: () => ConfiguredAgent;
  setup: () => Promise<boolean>;
  tearDown: () => Promise<boolean>;
}) => {
  describe('OIDC Plugin', () => {
    let agent: ConfiguredAgent;

    beforeAll(async () => {
      await testContext.setup();
      agent = testContext.getAgent();
      console.log('agent', agent);
    });

    it.todo('Tests');

    afterAll(async () => {
      await testContext.tearDown();
    });
  });
};
