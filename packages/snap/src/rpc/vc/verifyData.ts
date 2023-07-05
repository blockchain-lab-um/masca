import type { VerifyDataRequestParams } from '@blockchain-lab-um/masca-types';
import {
  isVerifiableCredential,
  isVerifiablePresentation,
} from '@blockchain-lab-um/utils';
import type { IVerifyResult } from '@veramo/core';

import type { ApiParams } from '../../interfaces';
import { veramoVerifyData } from '../../utils/veramoUtils';

export async function verifyData(
  params: ApiParams,
  args: VerifyDataRequestParams
): Promise<boolean | IVerifyResult> {
  const { snap, ethereum } = params;
  const verbose = args.verbose || false;

  if (args.credential && !isVerifiableCredential(args.credential))
    throw new Error('Invalid VC');
  if (args.presentation && !isVerifiablePresentation(args.presentation))
    throw new Error('Invalid VP');

  const res = await veramoVerifyData({
    snap,
    ethereum,
    data: args,
  });
  if (res.error) throw new Error(res.error.message);
  return verbose ? res : res.verified;
}
