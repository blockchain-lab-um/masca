import { TAgent } from '@veramo/core';

import { IOIDCRPPlugin } from '../../src/types/IOIDCRPPlugin.js';

export type ConfiguredAgent = TAgent<IOIDCRPPlugin>;

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

    afterAll(testContext.tearDown);
  });
};
