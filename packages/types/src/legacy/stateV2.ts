import type { IdentityMerkleTreeMetaInformation } from '@0xpolygonid/js-sdk';
import type { W3CVerifiableCredential } from '@veramo/core';

import type { AvailableMethods } from '../constants.js';

export const availableLegacyCredentialStoresV2 = ['snap', 'ceramic'] as const;
export type AvailableLegacyCredentialStoresV2 =
  (typeof availableLegacyCredentialStoresV2)[number];

export type LegacyMethodV2 =
  | 'queryCredentials'
  | 'saveCredential'
  | 'createPresentation'
  | 'deleteCredential'
  | 'togglePopups'
  | 'addTrustedDapp'
  | 'removeTrustedDapp'
  | 'getDID'
  | 'getSelectedMethod'
  | 'getAvailableMethods'
  | 'switchDIDMethod'
  | 'getCredentialStore'
  | 'setCredentialStore'
  | 'getAvailableCredentialStores'
  | 'getAccountSettings'
  | 'getSnapSettings'
  | 'getWalletId'
  | 'resolveDID'
  | 'createCredential'
  | 'setCurrentAccount'
  | 'verifyData'
  | 'handleCredentialOffer'
  | 'handleAuthorizationRequest'
  | 'setCeramicSession'
  | 'validateStoredCeramicSession'
  | 'exportStateBackup'
  | 'importStateBackup'
  | 'signData'
  | 'changePermission'
  | 'addDappSettings'
  | 'removeDappSettings';

export type MethodLegacyPermissionsV2 = {
  [key in LegacyMethodV2]: boolean;
};

export interface DappLegacyPermissionsV2 {
  methods: MethodLegacyPermissionsV2;
  trusted: boolean;
}

export interface MascaLegacyConfigV2 {
  snap: {
    acceptedTerms: boolean;
  };
  dApp: {
    disablePopups: boolean;
    permissions: Record<string, DappLegacyPermissionsV2>;
  };
}

export interface MascaLegacyAccountConfigV2 {
  ssi: {
    selectedMethod: AvailableMethods;
    storesEnabled: Record<AvailableLegacyCredentialStoresV2, boolean>;
  };
}

export interface MascaLegacyStateV2 {
  /**
   * Version 2 of Masca state
   */
  v2: {
    accountState: Record<string, MascaLegacyAccountStateV2>;
    currentAccount: string;
    config: MascaLegacyConfigV2;
  };
}

export interface MascaLegacyAccountStateV2 {
  polygon: {
    state: PolygonLegacyStateV2;
  };
  veramo: {
    credentials: Record<string, W3CVerifiableCredential>;
  };
  general: {
    account: MascaLegacyAccountConfigV2;
    ceramicSession?: string;
  };
}

export interface PolygonLegacyBaseStateV2 {
  credentials: Record<string, string>;
  identities: Record<string, string>;
  profiles: Record<string, string>;
  merkleTreeMeta: IdentityMerkleTreeMetaInformation[];
  merkleTree: Record<string, string>;
}

export enum DidMethodLegacyV2 {
  Iden3 = 'iden3',
  PolygonId = 'polygonid',
}

export enum BlockchainLegacyV2 {
  Ethereum = 'eth',
  Polygon = 'polygon',
}

export enum NetworkIdLegacyV2 {
  Main = 'main',
  Mumbai = 'mumbai',
}

export type PolygonLegacyStateV2 = Record<
  DidMethodLegacyV2.Iden3 | DidMethodLegacyV2.PolygonId,
  Record<
    BlockchainLegacyV2.Ethereum | BlockchainLegacyV2.Polygon,
    Record<
      NetworkIdLegacyV2.Main | NetworkIdLegacyV2.Mumbai,
      PolygonLegacyBaseStateV2
    >
  >
>;
