import { IPluginMethodMap } from '@veramo/core';
import { VerifiableCredential } from '@veramo/core';
import { MemoryVCStore } from '../vc-store/vc-store';
import { AbstractVCStore } from '../vc-store/abstract-vc-store';
import { VCQuery } from '@blockchain-lab-um/ssi-snap-types';
/**
 * IVCManager
 *
 * This is a plugin that enables management of VCs with Veramo client. It is similar to DIDManager and KeyManager plugins.
 * This plugin comes with {@link AbstractVCStore} and an example use {@link MemoryVCStore} where VCs are stored in memory.
 * AbstractVCStore can be extended to suit the needs.
 *
 *
 * @beta
 */
export interface IVCManager extends IPluginMethodMap {
  /**
   * Function to retrieve a VC with ID
   *
   * @param args - {@link IVCManagerGetArgs}
   *
   * @returns {@link IVCManagerGetResult}
   */
  getVC(args: IVCManagerGetArgs): Promise<IVCManagerGetResult>;

  /**
   * Function to save a VC
   *
   * @param args - {@link IVCManagerSaveArgs}
   *
   * @returns {boolean}
   */
  saveVC(args: IVCManagerSaveArgs): Promise<boolean>;

  /**
   * Function to delete a VC with ID
   *
   * @param args - {@link IVCManagerDeleteArgs}
   *
   * @returns {boolean}
   */
  deleteVC(args: IVCManagerDeleteArgs): Promise<boolean>;

  /**
   *
   *  Function to list all VCs
   *
   * @returns {@link IVCManagerListResult}
   */
  listVCS(args: IVCManagerListArgs): Promise<IVCManagerListResult>;
}

/**
 *
 * Arguments needed for {@link VCManager.getVC}
 *
 * @beta
 */
export interface IVCManagerGetArgs {
  /**
   * VCStore plugin
   */
  store: string;
  /**
   * Id of VC
   */
  id: string;
}
/**
 * Arguments needed for {@link VCManager.deleteVC}
 *
 * @beta
 */
export interface IVCManagerDeleteArgs {
  /**
   * VCStore plugin
   */
  store: string;
  /**
   * Id of VC
   */
  id: string;
}

export interface IVCManagerListArgs {
  /**
   * VCStore plugin
   */
  store: string;
  /**
   * Id of VC
   */
  query?: VCQuery;
}
/**
 * Arguments needed for {@link VCManager.saveVC}
 *
 * @beta
 */
export interface IVCManagerSaveArgs {
  /**
   * VCStore plugin
   */
  store: string;
  /**
   * VC
   */
  vc: VerifiableCredential;
}

/**
 * Result of {@link VCManager.getVC}
 *
 * @beta
 */
export type IVCManagerGetResult = {
  vc: VerifiableCredential | null;
};

/**
 * Result of {@link VCManager.listVCS}
 *
 * @beta
 */
export type IVCManagerListResult = {
  vcs: VerifiableCredential[];
};
