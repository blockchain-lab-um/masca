// Source: https://github.com/multiformats/multicodec/blob/master/table.csv
export type CodecName =
  | 'secp256k1-priv'
  | 'secp256k1-pub'
  | 'ed25519-priv'
  | 'jwk_jcs-pub'
  | 'ed25519-pub';

export const MULTICODECS: Record<CodecName, Uint8Array> = {
  'secp256k1-priv': new Uint8Array([129, 38]),
  'secp256k1-pub': new Uint8Array([231, 1]),
  'ed25519-priv': new Uint8Array([128, 38]),
  'jwk_jcs-pub': new Uint8Array([235, 81]),
  'ed25519-pub': new Uint8Array([237, 1]),
};
