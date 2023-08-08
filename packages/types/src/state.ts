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
    didMethod: AvailableMethods;
    vcStore: Record<AvailableCredentialStores, boolean>;
  };
}

export interface MascaState {
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
  snapConfig: MascaConfig;
}

/**
 * Masca State for a MetaMask address
 */
export interface MascaAccountState {
  // FIXME: Split into general, veramo, polygon
  polygonState: PolygonState;
  vcs: Record<string, W3CVerifiableCredential>;
  accountConfig: MascaAccountConfig;
  ceramicSession?: string;
  googleSession?: string;
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
