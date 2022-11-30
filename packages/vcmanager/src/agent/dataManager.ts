import { IAgentPlugin } from '@veramo/core';
import {
  IDataManager,
  IDataManagerClearArgs,
  IDataManagerDeleteArgs,
  IDataManagerQueryArgs,
  IDataManagerQueryResult,
  IDataManagerSaveArgs,
  IDataManagerSaveResult,
} from '../types/IDataManager';
import { AbstractDataStore } from '../data-store/abstractDataStore';

/**
 * {@inheritDoc IVCManager}
 * @beta
 */

export class DataManager implements IAgentPlugin {
  readonly methods: IDataManager = {
    save: this.save.bind(this),
    query: this.query.bind(this),
    delete: this.delete.bind(this),
    clear: this.clear.bind(this),
  };

  private storePlugins: Record<string, AbstractDataStore>;

  constructor(options: { store: Record<string, AbstractDataStore> }) {
    this.storePlugins = options.store;
  }

  public async save(
    args: IDataManagerSaveArgs
  ): Promise<Array<IDataManagerSaveResult>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data, options } = args;
    let { store } = options;
    if (typeof store === 'string') {
      store = [store];
    }
    const res: IDataManagerSaveResult[] = [];
    for (const storeName of store) {
      const storePlugin = this.storePlugins[storeName];
      if (!storePlugin) {
        throw new Error(`Store plugin ${storeName} not found`);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await storePlugin.save({ data, options });
      res.push({ id: result, store: storeName });
    }
    return res;
  }

  public async query(
    args: IDataManagerQueryArgs
  ): Promise<Array<IDataManagerQueryResult>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { filter = { type: 'none', filter: {} }, options } = args;
    let store;
    let returnStore = true;
    if (options === undefined) {
      store = Object.keys(this.storePlugins);
    } else {
      store = options.store;
      if (options.returnStore !== undefined) {
        returnStore = options.returnStore;
      }
    }
    if (typeof store === 'string') {
      store = [store];
    }
    let res: IDataManagerQueryResult[] = [];

    for (const storeName of store) {
      const storePlugin = this.storePlugins[storeName];
      if (!storePlugin) {
        throw new Error(`Store plugin ${storeName} not found`);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await storePlugin.query({ filter });
      const mappedResult = result.map((r) => {
        if (returnStore) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          return { data: r.data, meta: { id: r.id, store: storeName } };
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          return { data: r.data, meta: { id: r.id } };
        }
      });
      res = [...res, ...mappedResult];
    }
    return res;
  }

  public async delete(args: IDataManagerDeleteArgs): Promise<Array<boolean>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { id, options } = args;
    let store;
    if (options === undefined) {
      store = Object.keys(this.storePlugins);
    } else {
      store = options.store;
    }
    if (typeof store === 'string') {
      store = [store];
    }
    if (store === undefined) {
      store = Object.keys(this.storePlugins);
    }
    const res = [];
    for (const storeName of store) {
      const storePlugin = this.storePlugins[storeName];
      if (!storePlugin) {
        throw new Error(`Store plugin ${storeName} not found`);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const deleteResult = await storePlugin.delete({ id: id });
      res.push(deleteResult);
    }
    return res;
  }

  public async clear(args: IDataManagerClearArgs): Promise<Array<boolean>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { filter = { type: 'none', filter: {} }, options } = args;
    let store;
    if (options === undefined) {
      store = Object.keys(this.storePlugins);
    } else {
      store = options.store;
    }
    if (typeof store === 'string') {
      store = [store];
    }
    const res = [];
    for (const storeName of store) {
      const storePlugin = this.storePlugins[storeName];
      if (!storePlugin) {
        throw new Error(`Store plugin ${storeName} not found`);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const deleteResult = await storePlugin.clear({ filter });
      res.push(deleteResult);
    }
    return res;
  }
}
