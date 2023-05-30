import { DIDDocument } from 'did-resolver';

export type ICreateKeyDidOptions = {
  keyType?: keyof typeof KeyOptions;
  privateKeyHex?: string;
  type?: 'ebsi'; // Type whether to use classic did key or did key for EBSI NP
};

export type IResolveDidParams = {
  didIdentifier: string;
  publicKey: { pubKeyBytes: Uint8Array; code: number };
  keyType: keyof typeof KeyOptions;
};

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

export type CurveResolutionFunction = (
  params: IResolveDidParams
) => Promise<DIDDocument>;
