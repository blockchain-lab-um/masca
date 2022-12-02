import { VerifiableCredential } from '@veramo/core';
import { normalizeCredential } from 'did-jwt-vc';
import { deepCopy } from 'ethers/lib/utils';

export function decodeJWT(jwt: string): VerifiableCredential {
  try {
    const normalizedVC = normalizeCredential(jwt);
    const vc = deepCopy(normalizedVC);

    return vc;
  } catch (e) {
    throw new Error('Invalid JWT');
  }
}
