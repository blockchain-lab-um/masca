import { IdentityMerkleTreeMetaInformation } from '@0xpolygonid/js-sdk';
import { Blockchain, DidMethod, NetworkId } from '@iden3/js-iden3-core';
import type { IIdentifier, W3CVerifiableCredential } from '@veramo/core';

import type { AvailableMethods, AvailableVCStores } from './constants.js';

export type MascaConfig = {
  snap: {
    acceptedTerms: boolean;
  };
  dApp: {
    disablePopups: boolean;
    friendlyDapps: string[];
  };
};

export type MascaAccountConfig = {
  ssi: {
    didMethod: AvailableMethods;
    vcStore: Record<AvailableVCStores, boolean>;
  };
};

export type MascaState = {
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
};

/**
 * Masca State for a MetaMask address
 */
export type MascaAccountState = {
  polygonState: PolygonState;
  /**
   * Store for {@link SnapDIDStore}
   */
  identifiers: Record<string, IIdentifier>;
  /**
   * Store for {@link SnapVCStore}
   */
  vcs: Record<string, W3CVerifiableCredential>;
  publicKey: string;
  index?: number;
  accountConfig: MascaAccountConfig;
  ceramicSession?: string;
};

export type PolygonBaseState = {
  credentials: Record<string, string>;
  identities: Record<string, string>;
  profiles: Record<string, string>;
  // TODO: Maybe we can replace array with Record here
  merkleTreeMeta: IdentityMerkleTreeMetaInformation[];
  merkleTree: Record<string, string>;
};

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
