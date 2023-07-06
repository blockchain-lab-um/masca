/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { VerifyDataRequestParams } from '@blockchain-lab-um/masca-types';
import {
  isJWT,
  isW3CVerifiableCredential,
  isW3CVerifiablePresentation,
} from '@blockchain-lab-um/utils';
import type { IVerifyResult } from '@veramo/core';

import type { ApiParams } from '../../interfaces';
import { veramoVerifyData } from '../../utils/veramoUtils';

export async function verifyData(
  params: ApiParams,
  args: VerifyDataRequestParams
): Promise<boolean | IVerifyResult> {
  const { snap, ethereum } = params;
  const { credential, presentation } = args;
  const verbose = args.verbose || false;

  if (!credential && !presentation) throw new Error('Missing VC or VP');
  const checkValue = credential || presentation;
  if (checkValue && typeof checkValue === 'string' && !isJWT(checkValue))
    throw new Error('Invalid JWT string');
  if (credential && !isW3CVerifiableCredential(credential))
    throw new Error('Invalid VC');
  if (presentation && !isW3CVerifiablePresentation(presentation))
    throw new Error('Invalid VP');

  const res = await veramoVerifyData({
    snap,
    ethereum,
    data: args,
  });
  if (res.error) throw new Error(res.error.message);
  return verbose ? res : res.verified;
}
