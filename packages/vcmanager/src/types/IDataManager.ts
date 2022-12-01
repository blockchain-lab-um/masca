import { IPluginMethodMap } from '@veramo/core';
export interface IDataManager extends IPluginMethodMap {
  query(args: IDataManagerQueryArgs): Promise<Array<IDataManagerQueryResult>>;

  save(args: IDataManagerSaveArgs): Promise<Array<IDataManagerSaveResult>>;

  delete(args: IDataManagerDeleteArgs): Promise<Array<boolean>>;

  clear(args: IDataManagerClearArgs): Promise<Array<boolean>>;
}

type Filter = {
  type: string;
  filter: unknown;
};

type QueryOptions = {
  store?: string | string[];
  returnStore?: boolean;
};
export interface IDataManagerQueryArgs {
  filter?: Filter;
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
  filter?: Filter;
  options?: ClearOptions;
}

type QueryMetadata = {
  id: string;
  store?: string;
};

export type IDataManagerQueryResult = {
  data: any;
  metadata: QueryMetadata;
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
