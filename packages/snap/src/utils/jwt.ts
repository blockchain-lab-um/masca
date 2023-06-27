import type { VerifiableCredential } from '@veramo/core';
import { normalizeCredential } from 'did-jwt-vc';

export function decodeJWT(jwt: string): VerifiableCredential {
  try {
    const normalizedVC = normalizeCredential(jwt);

    return normalizedVC;
  } catch (e: any) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new Error(`Invalid JWT: ${e.message}`);
  }
}
