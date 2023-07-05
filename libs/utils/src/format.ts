import { varint } from 'multiformats';
import { base58btc } from 'multiformats/bases/base58';
import secp256k1 from 'secp256k1';

import { MULTICODEC_NAME_TO_CODE, type CodecName } from './multicodecs.js';

const { publicKeyConvert } = secp256k1;

export const encodePublicKey = (
  pubKeyBytes: Uint8Array,
  multicodec: CodecName
): string => {
  if (MULTICODEC_NAME_TO_CODE[multicodec]) {
    const code = parseInt(MULTICODEC_NAME_TO_CODE[multicodec], 16);
    const size = pubKeyBytes.byteLength;
    const sizeOffset = varint.encodingLength(code);

    const bytes = new Uint8Array(sizeOffset + size);
    varint.encodeTo(code, bytes, 0);
    bytes.set(pubKeyBytes, sizeOffset);

    return base58btc.encode(bytes);
  }

  throw new Error('multicodec not recognized');
};

export const decodePublicKey = (publicKey: string) => {
  const multicodecPubKey = base58btc.decode(publicKey);
  const [code, sizeOffset] = varint.decode(multicodecPubKey);
  const pubKeyBytes = multicodecPubKey.slice(sizeOffset);

  return {
    pubKeyBytes,
    code,
  };
};

export function uint8ArrayToHex(arr: Uint8Array) {
  return Buffer.from(arr).toString('hex');
}

export function hexToUint8Array(str: string): Uint8Array {
  return new Uint8Array(Buffer.from(str, 'hex'));
}

export function getCompressedPublicKey(publicKey: string): string {
  return uint8ArrayToHex(
    publicKeyConvert(hexToUint8Array(publicKey.slice(2)), true)
  );
}

export function isJWT(jwt: string): boolean {
  if (typeof jwt !== 'string') return false;
  return jwt.split('.').length === 3;
}
