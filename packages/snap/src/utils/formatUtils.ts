import { CodecName, MULTICODECS } from '../constants/multicodecs';

/**
 * Prefix a buffer with a multicodec-packed.
 *
 * @param {CodecName} multicodec
 * @param {Uint8Array} data
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
