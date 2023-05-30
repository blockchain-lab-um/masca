export type ICreateKeyDidOptions = {
  keyType?: keyof typeof KeyOptions;
  privateKeyHex?: string;
  type?: 'ebsi'; // Type whether to use classic did key or did key for EBSI NP
};

export const keyOptions = {
  Ed25519: 'ed25519-pub',
  X25519: 'x25519-pub',
  Secp256k1: 'secp256k1-pub',
  Secp256r1: 'p256-pub',
} as const;

export enum KeyOptions {
  Ed25519 = 'ed25519-pub',
  X25519 = 'x25519-pub',
  Secp256k1 = 'secp256k1-pub',
  Secp256r1 = 'p256-pub',
}

export type DidComponents = {
  scheme: string;
  method: string;
  version: string;
  multibaseValue: string;
};
