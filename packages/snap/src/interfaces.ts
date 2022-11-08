/* eslint-disable @typescript-eslint/no-unused-vars */
import { IIdentifier, IKey, VerifiableCredential } from '@veramo/core';
import { ManagedPrivateKey } from '@veramo/key-manager';
import { availableVCStores } from './veramo/plugins/availableVCStores';
import {
  SnapDIDStore,
  SnapVCStore,
} from './veramo/plugins/snapDataStore/snapDataStore';
import { availableMethods } from './did/didMethods';
import { SnapProvider } from '@metamask/snap-types';
import { BIP44CoinTypeNode } from '@metamask/key-tree';

export type SSISnapState = {
  /**
   * Account specific storage
   */
  accountState: Record<string, SSIAccountState>;

  /**
   * Configuration for SSISnap
   */
  snapConfig: SSISnapConfig;
};

export type ExtendedVerifiableCredential = VerifiableCredential & {
  /**
   * key for dictionary
   */
  key: string;
};

/**
 * Ceramic Network storedVCs
 */
export type StoredCredentials = {
  storedCredentials: ExtendedVerifiableCredential[];
};

export type SSISnapConfig = {
  snap: {
    /**
     * Infura token, used by Veramo agent.
     */
    infuraToken: string;
    acceptedTerms: boolean;
  };
  dApp: {
    disablePopups: boolean;
    friendlyDapps: string[];
  };
};

/**
 * SSI Snap State for a MetaMask address
 */
export type SSIAccountState = {
  /**
   * Store for {@link SnapPrivateKeyStore}
   */
  snapPrivateKeyStore: Record<string, ManagedPrivateKey>;
  /**
   * Store for {@link SnapKeyStore}
   */
  snapKeyStore: Record<string, IKey>;
  /**
   * Store for {@link SnapDIDStore}
   */
  identifiers: Record<string, IIdentifier>;
  /**
   * Store for {@link SnapVCStore}
   */
  vcs: Record<string, VerifiableCredential>;

  publicKey: string;
  index?: number;
  accountConfig: SSIAccountConfig;
};

export type SSIAccountConfig = {
  ssi: {
    didMethod: typeof availableMethods[number];
    vcStore: typeof availableVCStores[number];
  };
};

export type SnapConfirmParams = {
  prompt: string;
  description?: string;
  textAreaContent?: string;
};

export interface ApiParams {
  state: SSISnapState;
  wallet: SnapProvider;
  account: string;
  bip44Node?: BIP44CoinTypeNode;
}
