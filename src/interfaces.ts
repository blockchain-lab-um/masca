/* eslint-disable @typescript-eslint/no-unused-vars */
import { availableDataStores } from './veramo/plugins/availableDataStores';
import { IIdentifier, IKey, VerifiableCredential } from '@veramo/core';
import { ManagedPrivateKey } from '@veramo/key-manager';
import {
  SnapDIDStore,
  SnapKeyStore,
  SnapVCStore,
  SnapPrivateKeyStore,
} from './veramo/plugins/snapDataStore/snapDataStore';
import { availableMethods } from './did/didMethods';

/**
 * MetaMask State
 */
export interface State {
  /**
   * Other objects created by other Snaps
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [snapStates: string]: any;
  /**
   * SSI Snap Object
   */
  ssiSnapState: SSISnapState;
}

/**
 * SSI Snap State
 */
export interface SSISnapStateRaw {
  /**
   * MetaMask Address: SSIAccountState object
   */
  [address: string]: SSIAccountState;
}

export type SSISnapState = SSISnapStateRaw & {
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

export interface SSISnapConfig {
  snap: {
    /**
     * Infura token, used by Veramo agent.
     */
    infuraToken: string;
    acceptedTerms: boolean;
  };
  dApp: {
    disablePopups: boolean;
    friendlyDapps: Array<string>;
  };
}

/**
 * SSI Snap State for a MetaMask address
 */
export interface SSIAccountState {
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
  accountConfig: SSIAccountConfig;
}

export interface SSIAccountConfig {
  ssi: {
    didMethod: typeof availableMethods[number];
    didStore: typeof availableDataStores[number];
  };
}
