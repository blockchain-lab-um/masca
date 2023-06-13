import type { VerifyDataRequestParams } from '@blockchain-lab-um/masca-types';
import type { IVerifyResult } from '@veramo/core';

import type { ApiParams } from '../../interfaces';
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
  if (res.error) throw new Error(res.error.message);
  const parsedRes = JSON.parse(JSON.stringify(res)) as IVerifyResult;
  return verbose ? parsedRes : parsedRes.verified;
}
