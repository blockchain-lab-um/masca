import jsonpath from 'jsonpath';
import { v4 } from 'uuid';

import {
  AbstractDataStore,
  type IDeleteArgs,
  type IFilterArgs,
  type IQueryResult,
  type ISaveArgs,
} from './abstractDataStore.js';

/**
 * An implementation of {@link AbstractDataStore} that stores everything in memory.
 */
export class MemoryDataStore extends AbstractDataStore {
  private data: Record<string, unknown> = {};

  public async save(args: ISaveArgs): Promise<string> {
    const id = v4();
    this.data[id] = args.data;
    return id;
  }

  public async delete(args: IDeleteArgs): Promise<boolean> {
    const { id } = args;
    if (id in this.data) {
      delete this.data[id];
      return true;
    }
    return false;
  }

  public async query(args: IFilterArgs): Promise<Array<IQueryResult>> {
    const { filter } = args;
    if (filter && filter.type === 'id') {
      try {
        if (this.data[filter.filter]) {
          const obj = [
            {
              metadata: { id: filter.filter },
              data: this.data[filter.filter],
            },
          ];
          return obj;
        }
        return [];
      } catch (e) {
        throw new Error('Invalid id');
      }
    }
    if (filter === undefined || (filter && filter.type === 'none')) {
      return Object.keys(this.data).map((k) => ({
        metadata: { id: k },
        data: this.data[k],
      }));
    }
    if (filter && filter.type === 'JSONPath') {
      const objects = Object.keys(this.data).map((k) => ({
        metadata: { id: k },
        data: this.data[k],
      }));
      const filteredObjects = jsonpath.query(objects, filter.filter);
      return filteredObjects as Array<IQueryResult>;
    }
    return [];
  }

  public async clear(args: IFilterArgs): Promise<boolean> {
    this.data = {};
    return true;
  }
}
