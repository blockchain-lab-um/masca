import type { IPluginMethodMap } from '@veramo/core';

export interface IDataManager extends IPluginMethodMap {
  query(args: IDataManagerQueryArgs): Promise<IDataManagerQueryResult[]>;

  save(args: IDataManagerSaveArgs): Promise<IDataManagerSaveResult[]>;

  delete(args: IDataManagerDeleteArgs): Promise<boolean[]>;

  clear(args: IDataManagerClearArgs): Promise<boolean[]>;
}

/**
 *  Types
 */
export interface Filter {
  type: 'none' | 'id' | 'JSONPath';
  filter: string;
}

interface QueryOptions {
  store?: string | string[];
  returnStore?: boolean;
}

interface DeleteOptions {
  store: string | string[];
}

interface SaveOptions {
  store: string | string[];
}

interface ClearOptions {
  store: string | string[];
}

interface QueryMetadata {
  id: string;
  store?: string;
}

/**
 *  Interfaces for DataManager method arguments
 */
export interface IDataManagerQueryArgs {
  filter?: Filter;
  options?: QueryOptions;
}

export interface IDataManagerDeleteArgs {
  id: string;
  options?: DeleteOptions;
}

export interface IDataManagerSaveArgs {
  data: unknown;
  options: SaveOptions;
}

export interface IDataManagerClearArgs {
  filter?: Filter;
  options?: ClearOptions;
}

/**
 * Interfaces for DataManager method return values
 */
export interface IDataManagerQueryResult {
  data: unknown;
  metadata: QueryMetadata;
}

export interface IDataManagerSaveResult {
  id: string;
  store: string;
}
