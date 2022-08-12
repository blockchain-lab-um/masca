import { IIdentifier, IKey, VerifiableCredential } from "@veramo/core";
import { ManagedPrivateKey } from "@veramo/key-manager";
import {
  SnapDIDStore,
  SnapKeyStore,
  SnapVCStore,
  SnapPrivateKeyStore,
} from "./veramo/plugins/snapDataStore/snapDataStore";

/**
 * MetaMask State
 */
export interface State {
  /**
   * Other objects created by other Snaps
   */
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
  config: SSISnapConfig;
};

export type ExtendedVerifiableCredential = VerifiableCredential & {
  /**
   * key for dictionary
   */
  key: string;
};

export interface SSISnapConfig {
  veramo: {
    /**
     * Type of store, 'snap' by default
     */
    store: string;
    /**
     * Infura token, used by Veramo agent.
     */
    infuraToken: string;
    /**
     * dApp settings
     */
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
  /**
   * Signed message is used for generating other DIDs using key method
   */
  signedMessage: string;
  didMethod: string;
}
