// Source: https://github.com/multiformats/multicodec/blob/master/table.csv
export type CodecName =
  | 'secp256k1-priv'
  | 'secp256k1-pub'
  | 'ed25519-priv'
  | 'ed25519-pub'
  | 'jwk_jcs-pub'
  | 'x25519-priv'
  | 'x25519-pub'
  | 'p256-priv'
  | 'p256-pub';

export const MULTICODECS: Record<CodecName, Uint8Array> = {
  'secp256k1-priv': new Uint8Array([129, 38]),
  'secp256k1-pub': new Uint8Array([231, 1]),
  'ed25519-priv': new Uint8Array([128, 38]),
  'ed25519-pub': new Uint8Array([237, 1]),
  'jwk_jcs-pub': new Uint8Array([235, 81]),
  'x25519-priv': new Uint8Array([128, 40]),
  'x25519-pub': new Uint8Array([238, 1]),
  'p256-priv': new Uint8Array([128, 39]),
  'p256-pub': new Uint8Array([235, 7]),
};

export const MULTICODECSCODES: Record<CodecName, string> = {
  'secp256k1-priv': '0x1301',
  'secp256k1-pub': '0xe7',
  'ed25519-priv': '0x1300',
  'ed25519-pub': '0xed',
  'jwk_jcs-pub': '0xeb51',
  'x25519-priv': '0x1302',
  'x25519-pub': '0xec',
  'p256-priv': '0x1306',
  'p256-pub': '0x1200',
};

export const keyLengthsMap: Record<CodecName, number> = {
  'secp256k1-priv': 32,
  'secp256k1-pub': 33,
  'ed25519-priv': 32,
  'ed25519-pub': 32,
  'jwk_jcs-pub': 32,
  'x25519-priv': 32,
  'x25519-pub': 32,
  'p256-priv': 32,
  'p256-pub': 65,
};
