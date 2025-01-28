import type { IdentityMerkleTreeMetaInformation } from '@0xpolygonid/js-sdk';

import type { W3CVerifiableCredential } from '@veramo/core';

import type {
  AvailableCredentialStores,
  AvailableMethods,
} from '../constants.js';

export type LegacyMethodV4 =
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

export type MethodLegacyPermissionsV4 = {
  [key in LegacyMethodV4]: boolean;
};

export interface DappLegacyPermissionsV4 {
  methods: MethodLegacyPermissionsV4;
  trusted: boolean;
}

export interface MascaLegacyConfigV4 {
  snap: {
    acceptedTerms: boolean;
  };
  dApp: {
    disablePopups: boolean;
    permissions: Record<string, DappLegacyPermissionsV4>;
  };
}

export interface MascaLegacyAccountConfigV4 {
  ssi: {
    selectedMethod: AvailableMethods;
    storesEnabled: Record<AvailableCredentialStores, boolean>;
  };
}

export interface MascaLegacyStateV4 {
  /**
   * Version 4 of Masca state
   */
  v4: {
    accountState: Record<string, MascaLegacyAccountStateV4>;
    currentAccount: string;
    config: MascaLegacyConfigV4;
  };
}

export interface MascaLegacyAccountStateV4 {
  polygon: {
    state: PolygonLegacyStateV4;
  };
  veramo: {
    credentials: Record<string, W3CVerifiableCredential>;
  };
  general: {
    account: MascaLegacyAccountConfigV4;
    ceramicSession?: string;
  };
}

export interface PolygonLegacyBaseStateV4 {
  credentials: Record<string, string>;
  identities: Record<string, string>;
  profiles: Record<string, string>;
  merkleTreeMeta: IdentityMerkleTreeMetaInformation[];
  merkleTree: Record<string, string>;
}

export enum DidMethodLegacyV4 {
  Iden3 = 'iden3',
  PolygonId = 'polygonid',
}

export enum BlockchainLegacyV4 {
  Polygon = 'polygon',
}

export enum NetworkIdLegacyV4 {
  Main = 'main',
  Amoy = 'amoy',
}

export type PolygonLegacyStateV4 = Record<
  DidMethodLegacyV4.Iden3 | DidMethodLegacyV4.PolygonId,
  Record<
    BlockchainLegacyV4.Polygon,
    Record<
      NetworkIdLegacyV4.Main | NetworkIdLegacyV4.Amoy,
      PolygonLegacyBaseStateV4
    >
  >
>;
