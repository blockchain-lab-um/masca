import { isError } from '@blockchain-lab-um/utils';
import { beforeAll, describe, it } from 'vitest';

import { VerificationService } from '../src/Verification.service';

describe('Veramo Service', () => {
  beforeAll(async () => {
    await VerificationService.init();
  });

  it('should verify a valid credential', async () => {
    const result = await VerificationService.verify({} as any);

    console.log(result);

    if (isError(result)) {
      throw new Error(result.error);
    }

    console.log(result);
  });

  it('should verify a valid presentation', async () => {});
});
