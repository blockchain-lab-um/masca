import { Result, ResultObject } from '@blockchain-lab-um/utils';
import type { IAgentPlugin } from '@veramo/core';

import { IExtendedVerificationPlugin } from '../types';

export class ExtendedVerificationPlugin implements IAgentPlugin {
  readonly methods: IExtendedVerificationPlugin = {
    test: this.test.bind(this),
  };

  public async test(): Promise<Result<any>> {
    return ResultObject.success('test');
  }
}

export default ExtendedVerificationPlugin;
