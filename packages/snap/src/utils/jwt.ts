import type { VerifiableCredential } from '@veramo/core';
import { normalizeCredential } from 'did-jwt-vc';
import cloneDeep from 'lodash.clonedeep';

export function decodeJWT(jwt: string): VerifiableCredential {
  try {
    const normalizedVC = normalizeCredential(jwt);
    const vc = cloneDeep(normalizedVC);

    return vc;
  } catch (e) {
    throw new Error('Invalid JWT');
  }
}
