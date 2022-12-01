import {
  AbstractDataStore,
  SaveArgs,
  FilterArgs,
  QueryRes,
  DeleteArgs,
} from './abstractDataStore';
import { v4 } from 'uuid';
import jsonpath from 'jsonpath';
export class MemoryDataStore extends AbstractDataStore {
  private data: Record<string, any> = {};

  // eslint-disable-next-line @typescript-eslint/require-await
  public async save(args: SaveArgs): Promise<string> {
    const data: unknown = args.data;
    const id = v4();
    this.data[id] = data;
    return id;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async delete(args: DeleteArgs): Promise<boolean> {
    const { id } = args;
    if (this.data[id]) {
      delete this.data[id];
      return true;
    }
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async query(args: FilterArgs): Promise<Array<QueryRes>> {
    const { filter } = args;
    if (filter && filter.type === 'id') {
      try {
        if (this.data[filter.filter as string]) {
          const obj = [
            {
              metadata: { id: filter.filter as string },
              data: this.data[filter.filter as string] as unknown,
            },
          ];
          return obj;
        } else return [];
      } catch (e) {
        throw new Error('Invalid id');
      }
    }
    if (filter === undefined || (filter && filter.type === 'none')) {
      return Object.keys(this.data).map((k) => {
        return {
          metadata: { id: k },
          data: this.data[k] as unknown,
        };
      });
    }
    if (filter && filter.type === 'jsonpath') {
      const objects = Object.keys(this.data).map((k) => {
        return {
          metadata: { id: k },
          data: this.data[k] as unknown,
        };
      });
      const filteredObjects = jsonpath.query(objects, filter.filter as string);
      return filteredObjects as Array<QueryRes>;
    }
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async clear(args: FilterArgs): Promise<boolean> {
    this.data = {};
    return true;
  }
}
