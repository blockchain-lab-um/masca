import type { IdentityMerkleTreeMetaInformation } from '@0xpolygonid/js-sdk';
import type { W3CVerifiableCredential } from '@veramo/core';
import type { AvailableMethods } from '../constants';

export const availableLegacyCredentialStoresV1 = ['snap', 'ceramic'] as const;
export type AvailableLegacyCredentialStoresV1 =
  (typeof availableLegacyCredentialStoresV1)[number];

export interface MascaLegacyConfigV1 {
  snap: {
    acceptedTerms: boolean;
  };
  dApp: {
    disablePopups: boolean;
    friendlyDapps: string[];
  };
}

export interface MascaLegacyAccountConfigV1 {
  ssi: {
    selectedMethod: AvailableMethods;
    storesEnabled: Record<AvailableLegacyCredentialStoresV1, boolean>;
  };
}

/**
 * Version 1 of Masca state
 */
export interface MascaLegacyStateV1 {
  v1: {
    accountState: Record<string, MascaLegacyAccountStateV1>;
    currentAccount: string;
    config: MascaLegacyConfigV1;
  };
}

export interface MascaLegacyAccountStateV1 {
  polygon: {
    state: PolygonLegacyStateV1;
  };
  veramo: {
    credentials: Record<string, W3CVerifiableCredential>;
  };
  general: {
    account: MascaLegacyAccountConfigV1;
    ceramicSession?: string;
  };
}

export interface PolygonLegacyBaseStateV1 {
  credentials: Record<string, string>;
  identities: Record<string, string>;
  profiles: Record<string, string>;
  merkleTreeMeta: IdentityMerkleTreeMetaInformation[];
  merkleTree: Record<string, string>;
}

export enum DidMethodLegacyV1 {
  Iden3 = 'iden3',
  PolygonId = 'polygonid',
}

export enum BlockchainLegacyV1 {
  Ethereum = 'eth',
  Polygon = 'polygon',
}

export enum NetworkIdLegacyV1 {
  Main = 'main',
  Mumbai = 'mumbai',
  Goerli = 'goerli',
}

export type PolygonLegacyStateV1 = Record<
  DidMethodLegacyV1.Iden3 | DidMethodLegacyV1.PolygonId,
  Record<
    BlockchainLegacyV1.Ethereum | BlockchainLegacyV1.Polygon,
    Record<
      | NetworkIdLegacyV1.Main
      | NetworkIdLegacyV1.Goerli
      | NetworkIdLegacyV1.Mumbai,
      PolygonLegacyBaseStateV1
    >
  >
>;
