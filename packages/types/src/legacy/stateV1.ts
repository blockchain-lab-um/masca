import type { IdentityMerkleTreeMetaInformation } from '@0xpolygonid/js-sdk';
import type { W3CVerifiableCredential } from '@veramo/core';

import type {
  AvailableCredentialStores,
  AvailableMethods,
} from '../constants.js';

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
    storesEnabled: Record<AvailableCredentialStores, boolean>;
  };
}

export interface MascaLegacyStateV1 {
  /**
   * Version 1 of Masca state
   */
  v1: {
    /**
     * Account specific storage
     */
    accountState: Record<string, MascaLegacyAccountStateV1>;
    /**
     * Current account
     */
    currentAccount: string;
    /**
     * Configuration for Masca
     */
    config: MascaLegacyConfigV1;
  };
}

/**
 * Masca State for a MetaMask address
 */
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
  PolygonId = 'polygon',
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
