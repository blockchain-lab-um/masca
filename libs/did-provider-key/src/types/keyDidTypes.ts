import { CodecName, isIn } from '@blockchain-lab-um/utils';
import { DIDDocument } from 'did-resolver';

export type ICreateKeyDidOptions = {
  keyType?: KeyType;
  privateKeyHex?: string;
  type?: 'ebsi'; // Type whether to use classic did key or did key for EBSI NP
};

export type IResolveDidParams = {
  didIdentifier: string;
  publicKey: { pubKeyBytes: Uint8Array; code: number };
  keyType: KeyType;
};

export const KEY_TYPES = [
  'Ed25519',
  'X25519',
  'Secp256k1',
  'Secp256r1',
] as const;

export type KeyType = (typeof KEY_TYPES)[number];

export const isSupportedKeyType = (keyType: string) =>
  isIn<KeyType>(KEY_TYPES, keyType);

export const MULTICODEC_NAME_TO_KEY_TYPE: Record<string, KeyType> = {
  'secp256k1-pub': 'Secp256k1',
  'ed25519-pub': 'Ed25519',
  'x25519-pub': 'X25519',
  'p256-pub': 'Secp256r1',
};

export const KEY_TYPE_TO_MULTICODEC_NAME: Record<KeyType, CodecName> = {
  Secp256k1: 'secp256k1-pub',
  Ed25519: 'ed25519-pub',
  X25519: 'x25519-pub',
  Secp256r1: 'p256-pub',
};

export type DidComponents = {
  scheme: string;
  method: string;
  version: string;
  multibaseValue: string;
};

export type CurveResolutionFunction = (
  params: IResolveDidParams
) => Promise<DIDDocument>;
