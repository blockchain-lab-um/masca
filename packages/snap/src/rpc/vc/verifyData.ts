import type { VerifyDataRequestParams } from '@blockchain-lab-um/masca-types';
import type { IVerifyResult } from '@veramo/core';

import VeramoService from '../../veramo/Veramo.service';

export async function verifyData(
  args: VerifyDataRequestParams
): Promise<boolean | IVerifyResult> {
  const verbose = args.verbose || false;

  const res = await VeramoService.verifyData(args);

  if (res.error) throw new Error(res.error.message);
  return verbose ? res : res.verified;
}
