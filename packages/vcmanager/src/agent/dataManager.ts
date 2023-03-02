import { IAgentPlugin } from '@veramo/core';

import { AbstractDataStore } from '../data-store/abstractDataStore';
import {
  IDataManager,
  IDataManagerClearArgs,
  IDataManagerDeleteArgs,
  IDataManagerQueryArgs,
  IDataManagerQueryResult,
  IDataManagerSaveArgs,
  IDataManagerSaveResult,
} from '../types/IDataManager';

export class DataManager implements IAgentPlugin {
  readonly methods: IDataManager = {
    save: this.save.bind(this),
    query: this.query.bind(this),
    delete: this.delete.bind(this),
    clear: this.clear.bind(this),
  };

  private stores: Record<string, AbstractDataStore>;

  constructor(options: { store: Record<string, AbstractDataStore> }) {
    this.stores = options.store;
  }

  public async save(
    args: IDataManagerSaveArgs
  ): Promise<Array<IDataManagerSaveResult>> {
    const { data } = args;
    const { options } = args;
    let { store } = args.options;
    if (typeof store === 'string') {
      store = [store];
    }
    const res: IDataManagerSaveResult[] = [];

    await Promise.all(
      store.map(async (storeName) => {
        const storePlugin = this.stores[storeName];
        if (!storePlugin) {
          throw new Error(`Store plugin ${storeName} not found`);
        }
        try {
          const result = await storePlugin.save({ data, options });
          res.push({ id: result, store: storeName });
        } catch (e) {
          console.log(e);
        }
      })
    );

    return res;
  }

  public async query(
    args: IDataManagerQueryArgs
  ): Promise<Array<IDataManagerQueryResult>> {
    const { filter = { type: 'none', filter: {} }, options } = args;
    let store;
    let returnStore = true;
    if (options === undefined) {
      store = Object.keys(this.stores);
    } else {
      if (options.store !== undefined) {
        store = options.store;
      } else {
        store = Object.keys(this.stores);
      }
      if (options.returnStore !== undefined) {
        returnStore = options.returnStore;
      }
    }
    if (typeof store === 'string') {
      store = [store];
    }
    let res: IDataManagerQueryResult[] = [];

    await Promise.all(
      store.map(async (storeName) => {
        const storePlugin = this.stores[storeName];
        if (!storePlugin) {
          throw new Error(`Store plugin ${storeName} not found`);
        }

        try {
          const result = await storePlugin.query({ filter });
          const mappedResult = result.map((r) => {
            if (returnStore) {
              return {
                data: r.data,
                metadata: { id: r.metadata.id, store: storeName },
              };
            }
            return { data: r.data, metadata: { id: r.metadata.id } };
          });
          res = [...res, ...mappedResult];
        } catch (e) {
          console.log(e);
        }
      })
    );

    return res;
  }

  public async delete(args: IDataManagerDeleteArgs): Promise<Array<boolean>> {
    const { id, options } = args;
    let store;
    if (options === undefined) {
      store = Object.keys(this.stores);
    } else {
      store = options.store;
    }
    if (typeof store === 'string') {
      store = [store];
    }
    if (store === undefined) {
      store = Object.keys(this.stores);
    }
    const res: boolean[] = [];
    await Promise.all(
      store.map(async (storeName) => {
        const storePlugin = this.stores[storeName];
        if (!storePlugin) {
          throw new Error(`Store plugin ${storeName} not found`);
        }
        try {
          const deleteResult = await storePlugin.delete({ id });
          res.push(deleteResult);
        } catch (e) {
          console.log(e);
        }
      })
    );

    return res;
  }

  public async clear(args: IDataManagerClearArgs): Promise<Array<boolean>> {
    const { filter = { type: 'none', filter: {} }, options } = args;
    let store;
    if (options === undefined) {
      store = Object.keys(this.stores);
    } else if (options.store !== undefined) {
      store = options.store;
    } else {
      store = Object.keys(this.stores);
    }
    if (typeof store === 'string') {
      store = [store];
    }
    const res: boolean[] = [];
    await Promise.all(
      store.map(async (storeName) => {
        const storePlugin = this.stores[storeName];
        if (!storePlugin) {
          throw new Error(`Store plugin ${storeName} not found`);
        }
        try {
          const deleteResult = await storePlugin.clear({ filter });
          res.push(deleteResult);
        } catch (e) {
          console.log(e);
        }
      })
    );

    return res;
  }
}
