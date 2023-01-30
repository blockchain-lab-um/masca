/* eslint-disable no-else-return */
import { VerificationMethod } from 'did-resolver';
import { ec as EC } from 'elliptic';
import { bases } from 'multiformats/basics';
import {
  hexToBytes,
  bytesToHex,
  base64ToBytes,
  base58ToBytes,
} from '@veramo/utils';

export function extractPublicKeyBytes(pk: VerificationMethod): Uint8Array {
  if (pk.publicKeyBase58) {
    return base58ToBytes(pk.publicKeyBase58);
  } else if (pk.publicKeyMultibase) {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    return bases['base58btc'].decode(pk.publicKeyMultibase);
  } else if (pk.publicKeyBase64) {
    return base64ToBytes(pk.publicKeyBase64);
  } else if (pk.publicKeyHex) {
    return hexToBytes(pk.publicKeyHex);
  } else if (
    pk.publicKeyJwk &&
    pk.publicKeyJwk.crv === 'secp256k1' &&
    pk.publicKeyJwk.x &&
    pk.publicKeyJwk.y
  ) {
    const secp256k1 = new EC('secp256k1');
    return hexToBytes(
      secp256k1
        .keyFromPublic({
          x: bytesToHex(base64ToBytes(pk.publicKeyJwk.x)),
          y: bytesToHex(base64ToBytes(pk.publicKeyJwk.y)),
        })
        .getPublic('hex')
    );
  } else if (
    pk.publicKeyJwk &&
    pk.publicKeyJwk.crv === 'Ed25519' &&
    pk.publicKeyJwk.x
  ) {
    return base64ToBytes(pk.publicKeyJwk.x);
  }
  return new Uint8Array();
}
