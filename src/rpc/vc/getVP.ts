import { veramoCreateVP } from '../../utils/veramoUtils';
import { VerifiablePresentation } from '@veramo/core';
import { SnapProvider } from '@metamask/snap-types';
import { SSISnapState } from '../../interfaces';

export async function getVP(
  wallet: SnapProvider,
  state: SSISnapState,
  account: string,
  vcId: string,
  domain?: string,
  challenge?: string
): Promise<VerifiablePresentation | null> {
  return await veramoCreateVP(wallet, state, account, vcId, challenge, domain);
}
