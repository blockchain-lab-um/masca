import {
  MascaAccountConfig,
  MascaConfig,
} from '@blockchain-lab-um/masca-types';
import { BIP44CoinTypeNode } from '@metamask/key-tree';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsGlobalObject } from '@metamask/snaps-types';
import { IIdentifier, IKey, W3CVerifiableCredential } from '@veramo/core';
import { ManagedPrivateKey } from '@veramo/key-manager';

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

export type ExtendedVerifiableCredential = W3CVerifiableCredential & {
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
};

export type SnapConfirmParams = {
  prompt: string;
  description?: string;
  textAreaContent?: string;
};

export interface ApiParams {
  state: MascaState;
  snap: SnapsGlobalObject;
  ethereum: MetaMaskInpageProvider;
  account: string;
  bip44CoinTypeNode?: BIP44CoinTypeNode;
  origin: string;
  ebsiBearer?: string;
}
