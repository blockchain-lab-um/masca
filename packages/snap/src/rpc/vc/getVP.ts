import { veramoCreateVP } from '../../utils/veramoUtils';
import { VerifiablePresentation } from '@veramo/core';
import { SnapProvider } from '@metamask/snap-types';
import { ApiParams, SSISnapState } from '../../interfaces';

export async function getVP(
  params: ApiParams,
  vcId: string,
  domain?: string,
  challenge?: string
): Promise<VerifiablePresentation | null> {
  const { state, wallet, account, bip44Node } = params;
  return await veramoCreateVP(wallet, state, account, vcId, challenge, domain);
}
