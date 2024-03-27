import type { IdentityMerkleTreeMetaInformation } from '@0xpolygonid/js-sdk';

import type { W3CVerifiableCredential } from '@veramo/core';

import type {
  AvailableCredentialStores,
  AvailableMethods,
} from './constants.js';
import type { MascaRPCRequest } from './requests.js';

export type MethodPermissions = {
  [key in MascaRPCRequest['method']]: boolean;
};

export interface DappPermissions {
  methods: MethodPermissions;
  trusted: boolean;
}

export interface MascaConfig {
  snap: {
    acceptedTerms: boolean;
  };
  dApp: {
    disablePopups: boolean;
    permissions: Record<string, DappPermissions>;
  };
}

export interface MascaAccountConfig {
  ssi: {
    selectedMethod: AvailableMethods;
    storesEnabled: Record<AvailableCredentialStores, boolean>;
  };
}

export interface MascaState {
  v3: {
    accountState: Record<string, MascaAccountState>;
    currentAccount: string;
    config: MascaConfig;
  };
}

export interface MascaAccountState {
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
  merkleTreeMeta: IdentityMerkleTreeMetaInformation[];
  merkleTree: Record<string, string>;
}

export enum DidMethod {
  Iden3 = 'iden3',
  PolygonId = 'polygonid',
}

export enum Blockchain {
  Polygon = 'polygon',
}

export enum NetworkId {
  Main = 'main',
  Mumbai = 'mumbai',
}

export type PolygonState = Record<
  DidMethod.Iden3 | DidMethod.PolygonId,
  Record<
    Blockchain.Polygon,
    Record<NetworkId.Main | NetworkId.Mumbai, PolygonBaseState>
  >
>;
