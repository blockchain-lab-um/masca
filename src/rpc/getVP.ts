import { veramoCreateVP } from '../utils/veramoUtils';
import { VerifiablePresentation } from '@veramo/core';
import { SnapProvider } from '@metamask/snap-types';

export async function getVP(
  wallet: SnapProvider,
  vcId: string,
  domain?: string,
  challenge?: string
): Promise<VerifiablePresentation | null> {
  if (vcId === '') throw new Error('vcId is empty');
  const vp = await veramoCreateVP(wallet, vcId, challenge, domain);
  return vp;
}
