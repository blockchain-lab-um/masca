import { IPluginMethodMap } from '@veramo/core';
import { VerifiableCredential } from '@veramo/core';
import { MemoryDataStore } from '../data-store/data-store';
import { AbstractDataStore } from '../data-store/abstractDataStore';
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
export interface IDataManager extends IPluginMethodMap {
  /**
   * Function to retrieve a VC with ID
   *
   * @param args - {@link IVCManagerGetArgs}
   *
   * @returns {@link IVCManagerGetResult}
   */
  query(args: IDataManagerQueryArgs): Promise<Array<IDataManagerQueryResult>>;

  /**
   * Function to save a VC
   *
   * @param args - {@link IVCManagerSaveArgs}
   *
   * @returns {boolean}
   */
  save(args: IDataManagerSaveArgs): Promise<Array<IDataManagerSaveResult>>;

  /**
   * Function to delete a VC with ID
   *
   * @param args - {@link IVCManagerDeleteArgs}
   *
   * @returns {boolean}
   */
  delete(args: IDataManagerDeleteArgs): Promise<Array<boolean>>;

  /**
   *
   *  Function to list all VCs
   *
   * @returns {@link IVCManagerListResult}
   */
  clear(args: IDataManagerClearArgs): Promise<Array<boolean>>;
}

type QueryFilter = {
  type: string;
  filter: unknown;
};

type QueryOptions = {
  store: string | string[];
  returnStore?: boolean;
};
export interface IDataManagerQueryArgs {
  filter?: QueryFilter;
  options?: QueryOptions;
}
type DeleteOptions = {
  store: string | string[];
};
export interface IDataManagerDeleteArgs {
  id: string;
  options?: DeleteOptions;
}

type SaveOptions = {
  store: string | string[];
};
export interface IDataManagerSaveArgs {
  data: any;
  options: SaveOptions;
}

type ClearOptions = {
  store: string | string[];
};
export interface IDataManagerClearArgs {
  filter?: QueryFilter;
  options?: ClearOptions;
}

type QueryMetaData = {
  id: string;
  store?: string;
};

export type IDataManagerQueryResult = {
  data: any;
  meta: QueryMetaData;
};

/**
 * Result of {@link VCManager.listVCS}
 *
 * @beta
 */
export type IDataManagerSaveResult = {
  id: string;
  store: string;
};
