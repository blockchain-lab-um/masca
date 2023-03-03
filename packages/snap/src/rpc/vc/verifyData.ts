import { VerifyDataRequestParams } from '@blockchain-lab-um/ssi-snap-types';
import { IVerifyResult } from '@veramo/core';

import { ApiParams } from '../../interfaces';
import { veramoVerifyData } from '../../utils/veramoUtils';

export async function verifyData(
  params: ApiParams,
  args: VerifyDataRequestParams
): Promise<boolean | IVerifyResult> {
  const { snap, ethereum } = params;
  const verbose = args.verbose || false;

  const res = await veramoVerifyData({
    snap,
    ethereum,
    data: args,
  });
  if (res.error) throw res.error as Error;
  return verbose ? res : res.verified;
}
