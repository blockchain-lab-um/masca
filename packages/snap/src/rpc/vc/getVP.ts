import { veramoCreateVP } from '../../utils/veramoUtils';
import { VerifiablePresentation } from '@veramo/core';
import { ApiParams } from '../../interfaces';

export async function getVP(
  params: ApiParams,
  vcId: string,
  domain?: string,
  challenge?: string
): Promise<VerifiablePresentation | null> {
  return await veramoCreateVP(params, vcId, challenge, domain);
}
