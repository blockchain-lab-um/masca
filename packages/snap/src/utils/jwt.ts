import type { VerifiableCredential } from '@veramo/core';
import { normalizeCredential } from 'did-jwt-vc';

export function decodeJWT(jwt: string): VerifiableCredential {
  try {
    const normalizedVC = normalizeCredential(jwt);
    const vc = structuredClone(normalizedVC);

    return vc;
  } catch (e) {
    throw new Error('Invalid JWT');
  }
}
