/* eslint-disable new-cap */
import { bytesToBase64url, hexToBytes } from '@veramo/utils';
import elliptic from 'elliptic';

export enum IJWKSupportedKeyTypes {
  Secp256r1 = 'Secp256r1',
  Secp256k1 = 'Secp256k1',
  Ed25519 = 'Ed25519',
  X25519 = 'X25519',
}

export type KeyUse = 'sig' | 'enc';

export function getKeyUse(
  keyType: keyof typeof IJWKSupportedKeyTypes,
  passedKeyUse?: KeyUse
): KeyUse {
  if (passedKeyUse) {
    if (passedKeyUse !== 'sig' && passedKeyUse !== 'enc') {
      throw new Error('illegal_argument: Key use must be sig or enc');
    }
    if (passedKeyUse === 'sig' && keyType === IJWKSupportedKeyTypes.X25519) {
      throw new Error(
        'illegal_argument: X25519 keys cannot be used for signing'
      );
    }
    if (passedKeyUse === 'enc' && keyType === IJWKSupportedKeyTypes.Ed25519) {
      throw new Error(
        'illegal_argument: Ed25519 keys cannot be used for encryption'
      );
    }
    return passedKeyUse;
  }
  switch (keyType) {
    case IJWKSupportedKeyTypes.Secp256k1:
    case IJWKSupportedKeyTypes.Secp256r1:
    case IJWKSupportedKeyTypes.Ed25519:
      return 'sig';
    case IJWKSupportedKeyTypes.X25519:
      return 'enc';
    default:
      throw new Error('illegal_argument: Unknown key type');
  }
}

export function createJWK(
  keyType: keyof typeof IJWKSupportedKeyTypes,
  pubKey: string | Uint8Array,
  passedKeyUse?: KeyUse
): JsonWebKey | undefined {
  const keyUse = getKeyUse(keyType, passedKeyUse);
  switch (keyType) {
    case IJWKSupportedKeyTypes.Secp256k1: {
      const EC = new elliptic.ec('secp256k1');
      const pubPoint = EC.keyFromPublic(pubKey, 'hex').getPublic();
      const x = pubPoint.getX();
      const y = pubPoint.getY();

      return {
        alg: 'ES256K',
        crv: 'secp256k1',
        kty: 'EC',
        ...(keyUse && { use: keyUse }),
        x: bytesToBase64url(hexToBytes(x.toString('hex'))),
        y: bytesToBase64url(hexToBytes(y.toString('hex'))),
      } as JsonWebKey;
    }
    case IJWKSupportedKeyTypes.Secp256r1: {
      const EC = new elliptic.ec('p256');
      const pubPoint = EC.keyFromPublic(pubKey, 'hex').getPublic();
      const x = pubPoint.getX();
      const y = pubPoint.getY();

      return {
        alg: 'ES256',
        crv: 'P-256',
        kty: 'EC',
        ...(keyUse && { use: keyUse }),
        x: bytesToBase64url(hexToBytes(x.toString('hex'))),
        y: bytesToBase64url(hexToBytes(y.toString('hex'))),
      } as JsonWebKey;
    }
    case IJWKSupportedKeyTypes.Ed25519:
      return {
        alg: 'EdDSA',
        crv: 'Ed25519',
        kty: 'OKP',
        ...(keyUse && { use: keyUse }),
        x: bytesToBase64url(
          typeof pubKey === 'string' ? hexToBytes(pubKey) : pubKey
        ),
      } as JsonWebKey;
    case IJWKSupportedKeyTypes.X25519:
      return {
        alg: 'ECDH-ES',
        crv: 'X25519',
        kty: 'OKP',
        ...(keyUse && { use: keyUse }),
        x: bytesToBase64url(
          typeof pubKey === 'string' ? hexToBytes(pubKey) : pubKey
        ),
      } as JsonWebKey;
    default:
      throw new Error(`not_supported: Failed to create JWK for this key type.`);
  }
}
