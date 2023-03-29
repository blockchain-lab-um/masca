import { randomBytes } from 'crypto';
import { DIDDocument } from 'did-resolver';
import * as jose from 'jose';
import { base58btc } from 'multiformats/bases/base58';

import {
  IEbsiDidSupportedEcdsaAlgo,
  IEbsiDidSupportedKeyTypes,
} from './types/ebsiProviderTypes';

export const algoMap: Record<
  IEbsiDidSupportedKeyTypes,
  IEbsiDidSupportedEcdsaAlgo
> = {
  'P-256': 'ES256',
  Secp256k1: 'ES256K',
};

export function generateRandomEbsiSubjectIdentifier(): string {
  // TODO: probably refactor this to use u8a
  return Buffer.from(
    base58btc.encode(Buffer.concat([new Uint8Array([1]), randomBytes(16)]))
  ).toString();
}

export function generateEbsiSubjectIdentifier(
  sequence: Uint8Array | string | undefined
): string {
  if (!sequence) {
    throw new Error('Sequence is undefined');
  }
  if (sequence instanceof Uint8Array) {
    return Buffer.from(
      base58btc.encode(Buffer.concat([new Uint8Array([1]), sequence]))
    ).toString();
  }

  return Buffer.from(
    base58btc.encode(
      Buffer.concat([new Uint8Array([1]), Buffer.from(sequence, 'hex')])
    )
  ).toString();
}

export function privateKeyJwkToHex(privateKeyJwk: jose.JWK): string {
  if (!privateKeyJwk.d) {
    throw new Error('Key does not contain private key material');
  }
  return Buffer.from(privateKeyJwk.d, 'base64').toString('hex');
}

export function isOwner({
  didDoc,
  did,
}: {
  didDoc: DIDDocument;
  did: string;
}): boolean {
  if (didDoc.id === did) {
    return true;
  }
  return false;
}
