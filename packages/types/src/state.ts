import { IdentityMerkleTreeMetaInformation } from '@0xpolygonid/js-sdk';
import { Blockchain, DidMethod, NetworkId } from '@iden3/js-iden3-core';
import type { W3CVerifiableCredential } from '@veramo/core';

import type {
  AvailableCredentialStores,
  AvailableMethods,
} from './constants.js';

export interface MascaConfig {
  snap: {
    acceptedTerms: boolean;
  };
  dApp: {
    disablePopups: boolean;
    friendlyDapps: string[];
  };
}

export interface MascaAccountConfig {
  ssi: {
    selectedMethod: AvailableMethods;
    storesEnabled: Record<AvailableCredentialStores, boolean>;
  };
}

export interface MascaState {
  /**
   * Version 1 of Masca state
   */
  v1: {
    /**
     * Account specific storage
     */
    accountState: Record<string, MascaAccountState>;
    /**
     * Current account
     */
    currentAccount: string;
    /**
     * Configuration for Masca
     */
    config: MascaConfig;
  }
}

/**
 * Masca State for a MetaMask address
 */
export interface MascaAccountState {
  // FIXME: Split into general, veramo, polygon
  polygon: {
    state: PolygonState;
  };
  veramo: {
    credentials: Record<string, W3CVerifiableCredential>;
  };
  general: {
    account: MascaAccountConfig;
    ceramicSession?: string;
  };
}

export interface PolygonBaseState {
  credentials: Record<string, string>;
  identities: Record<string, string>;
  profiles: Record<string, string>;
  // TODO: Maybe we can replace array with Record here
  merkleTreeMeta: IdentityMerkleTreeMetaInformation[];
  merkleTree: Record<string, string>;
}

export type PolygonState = Record<
  DidMethod.Iden3 | DidMethod.PolygonId,
  Record<
    Blockchain.Ethereum | Blockchain.Polygon,
    Record<
      NetworkId.Main | NetworkId.Goerli | NetworkId.Mumbai,
      PolygonBaseState
    >
  >
>;
