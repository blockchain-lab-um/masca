export type IKeyCreateIdentifierOptions = {
  type?: string;
};

export type CreateKeyDidOptions = {
  keyType?: keyof typeof keyOptions;
  privateKeyHex?: string;
  type?: string;
};

const keyOptions = {
  Ed25519: 'ed25519-pub',
  X25519: 'x25519-pub',
  Secp256k1: 'secp256k1-pub',
} as const;
