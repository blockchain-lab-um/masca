import type { IIdentifier, IKey, W3CVerifiableCredential } from '@veramo/core';
import type { ManagedPrivateKey } from '@veramo/key-manager';

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
  vcs: Record<string, W3CVerifiableCredential>;

  publicKey: string;
  index?: number;
  accountConfig: MascaAccountConfig;
  ceramicSession?: string;
};
