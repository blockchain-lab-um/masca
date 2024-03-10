import type { VerifiableCredential } from '@veramo/core';
import { normalizeCredential } from 'did-jwt-vc';

/**
 * Function that decodes a JWT into a VerifiableCredential.
 * @param jwt - JWT to decode
 * @returns VerifiableCredential - decoded JWT
 */
export function decodeJWT(jwt: string): VerifiableCredential {
  try {
    const normalizedVC = normalizeCredential(jwt);

    return normalizedVC;
  } catch (e: any) {
    throw new Error(`Invalid JWT: ${e.message}`);
  }
}
