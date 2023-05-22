import { publicKeyConvert } from 'secp256k1';

import { CodecName, MULTICODECS } from './multicodecs.js';

/**
 * Prefix a buffer with a multicodec-packed.
 *
 * @param {CodecName} multicodec
 * @param {Uint8Array} data
 *
 * @returns {Uint8Array}
 */
export const addMulticodecPrefix = (
  multicodec: CodecName,
  data: Uint8Array
): Uint8Array => {
  let prefix;

  if (MULTICODECS[multicodec]) {
    prefix = Buffer.from(MULTICODECS[multicodec]);
  } else {
    throw new Error('multicodec not recognized');
  }

  return Buffer.concat([prefix, data], prefix.length + data.length);
};

export function uint8ArrayToHex(arr: Uint8Array) {
  return Buffer.from(arr).toString('hex');
}

export function hexToUint8Array(str: string): Uint8Array {
  return new Uint8Array(Buffer.from(str, 'hex'));
}
export function getCompressedPublicKey(publicKey: string): string {
  return uint8ArrayToHex(
    publicKeyConvert(hexToUint8Array(publicKey.split('0x')[1]), true)
  );
}
