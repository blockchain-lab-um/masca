import type { W3CVerifiableCredential } from '@veramo/core';

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
export type MascaAccountState = { // FIXME: Split into general, veramo, polygon
  /**
   * Store for {@link SnapVCStore}
   */
  vcs: Record<string, W3CVerifiableCredential>;
  accountConfig: MascaAccountConfig;
  ceramicSession?: string;
};
