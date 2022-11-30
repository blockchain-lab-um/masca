import {
  AbstractDataStore,
  SaveArgs,
  QueryArgs,
  QueryRes,
  DeleteArgs,
} from './abstractDataStore';
import { randomUUID } from 'crypto';

export class MemoryDataStore extends AbstractDataStore {
  private data: Record<string, any> = {};

  // eslint-disable-next-line @typescript-eslint/require-await
  public async save(args: SaveArgs): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data } = args;
    const id = randomUUID();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.data[id] = data;
    return id;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async delete(args: DeleteArgs): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { id } = args;
    if (this.data[id]) {
      delete this.data[id];
      return true;
    }
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async query(args: QueryArgs): Promise<Array<QueryRes>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { filter } = args;
    if (filter && filter.type === 'id') {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return
        if (this.data[filter.filter as string]) {
          const obj = [
            {
              id: filter.filter as string,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              data: this.data[filter.filter as string],
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
          id: k,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: this.data[k],
        };
      });
    }
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async clear(args: QueryArgs): Promise<boolean> {
    this.data = {};
    return true;
  }
}
