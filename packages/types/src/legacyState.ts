import { IdentityMerkleTreeMetaInformation } from '@0xpolygonid/js-sdk';
import { Blockchain, DidMethod, NetworkId } from '@iden3/js-iden3-core';
import type { W3CVerifiableCredential } from '@veramo/core';

import type {
  AvailableCredentialStores,
  AvailableMethods,
} from './constants.js';

interface MascaLegacyConfigV1 {
  snap: {
    acceptedTerms: boolean;
  };
  dApp: {
    disablePopups: boolean;
    friendlyDapps: string[];
  };
}

interface MascaLegacyAccountConfigV1 {
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
interface MascaLegacyAccountStateV1 {
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

interface PolygonLegacyBaseStateV1 {
  credentials: Record<string, string>;
  identities: Record<string, string>;
  profiles: Record<string, string>;
  merkleTreeMeta: IdentityMerkleTreeMetaInformation[];
  merkleTree: Record<string, string>;
}

type PolygonLegacyStateV1 = Record<
  DidMethod.Iden3 | DidMethod.PolygonId,
  Record<
    Blockchain.Ethereum | Blockchain.Polygon,
    Record<NetworkId.Main | NetworkId.Mumbai, PolygonLegacyBaseStateV1>
  >
>;
