import { varint } from 'multiformats';
import { base58btc } from 'multiformats/bases/base58';
import secp256k1 from 'secp256k1';

import { MULTICODEC_NAME_TO_CODE, type CodecName } from './multicodecs.js';

const { publicKeyConvert } = secp256k1;

/**
 * Function that encodes a public key to a multicodec string.
 * @param pubKeyBytes - public key bytes
 * @param multicodec - multicodec name
 * @returns
 */
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

/**
 * Function that decodes a public key from a multicodec string.
 * @param publicKey - multicodec string
 * @returns pubKeyBytes - public key bytes
 * @returns code - multicodec code
 */
export const decodePublicKey = (publicKey: string) => {
  const multicodecPubKey = base58btc.decode(publicKey);
  const [code, sizeOffset] = varint.decode(multicodecPubKey);
  const pubKeyBytes = multicodecPubKey.slice(sizeOffset);

  return {
    pubKeyBytes,
    code,
  };
};

/**
 * Function that converts a Uint8Array to a hex string.
 * @param arr - Uint8Array
 * @returns hex string
 */
export function uint8ArrayToHex(arr: Uint8Array) {
  return Buffer.from(arr).toString('hex');
}

/**
 * Function that converts a hex string to a Uint8Array.
 * @param str - hex string
 * @returns Uint8Array
 */
export function hexToUint8Array(str: string): Uint8Array {
  return new Uint8Array(Buffer.from(str, 'hex'));
}

/**
 * Function that converts a compressed public key to an uncompressed public key.
 * @param publicKey - compressed public key hex string
 * @returns uncompressed public key hex string
 */
export function getCompressedPublicKey(publicKey: string): string {
  return uint8ArrayToHex(
    publicKeyConvert(hexToUint8Array(publicKey.slice(2)), true)
  );
}
