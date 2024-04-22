import type { IdentityMerkleTreeMetaInformation } from '@0xpolygonid/js-sdk';

import type { W3CVerifiableCredential } from '@veramo/core';

import type {
  AvailableCredentialStores,
  AvailableMethods,
} from '../constants.js';

export type LegacyMethodV3 =
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

export type MethodLegacyPermissionsV3 = {
  [key in LegacyMethodV3]: boolean;
};

export interface DappLegacyPermissionsV3 {
  methods: MethodLegacyPermissionsV3;
  trusted: boolean;
}

export interface MascaLegacyConfigV3 {
  snap: {
    acceptedTerms: boolean;
  };
  dApp: {
    disablePopups: boolean;
    permissions: Record<string, DappLegacyPermissionsV3>;
  };
}

export interface MascaLegacyAccountConfigV3 {
  ssi: {
    selectedMethod: AvailableMethods;
    storesEnabled: Record<AvailableCredentialStores, boolean>;
  };
}

export interface MascaLegacyStateV3 {
  /**
   * Version 3 of Masca state
   */
  v3: {
    accountState: Record<string, MascaLegacyAccountStateV3>;
    currentAccount: string;
    config: MascaLegacyConfigV3;
  };
}

export interface MascaLegacyAccountStateV3 {
  polygon: {
    state: PolygonLegacyStateV3;
  };
  veramo: {
    credentials: Record<string, W3CVerifiableCredential>;
  };
  general: {
    account: MascaLegacyAccountConfigV3;
    ceramicSession?: string;
  };
}

export interface PolygonLegacyBaseStateV3 {
  credentials: Record<string, string>;
  identities: Record<string, string>;
  profiles: Record<string, string>;
  merkleTreeMeta: IdentityMerkleTreeMetaInformation[];
  merkleTree: Record<string, string>;
}

export enum DidMethodLegacyV3 {
  Iden3 = 'iden3',
  PolygonId = 'polygonid',
}

export enum BlockchainLegacyV3 {
  Polygon = 'polygon',
}

export enum NetworkIdLegacyV3 {
  Main = 'main',
  Mumbai = 'mumbai',
}

export type PolygonLegacyStateV3 = Record<
  DidMethodLegacyV3.Iden3 | DidMethodLegacyV3.PolygonId,
  Record<
    BlockchainLegacyV3.Polygon,
    Record<
      NetworkIdLegacyV3.Main | NetworkIdLegacyV3.Mumbai,
      PolygonLegacyBaseStateV3
    >
  >
>;
