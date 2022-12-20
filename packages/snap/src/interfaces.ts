/* eslint-disable @typescript-eslint/no-unused-vars */
import { IIdentifier, IKey, W3CVerifiableCredential } from '@veramo/core';
import { ManagedPrivateKey } from '@veramo/key-manager';
import {
  SSISnapConfig,
  SSIAccountConfig,
} from '@blockchain-lab-um/ssi-snap-types';
import { SnapsGlobalObject } from '@metamask/snaps-types';
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
  vcs: Record<string, W3CVerifiableCredential>;

  publicKey: string;
  index?: number;
  accountConfig: SSIAccountConfig;
};

export type SnapConfirmParams = {
  prompt: string;
  description?: string;
  textAreaContent?: string;
};

export interface ApiParams {
  state: SSISnapState;
  snap: SnapsGlobalObject;
  account: string;
  bip44CoinTypeNode?: BIP44CoinTypeNode;
}
