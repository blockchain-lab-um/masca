import { TAgent } from '@veramo/core';
import { IOIDCPlugin } from '../../src/types/IOIDCPlugin';

export type ConfiguredAgent = TAgent<IOIDCPlugin>;

// eslint-disable-next-line jest/no-export
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
