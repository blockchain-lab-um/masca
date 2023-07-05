import { IDataSource } from '@0xpolygonid/js-sdk';

import { getSnapState, updateSnapState } from '../../stateUtils';

type StorageKey = 'identities' | 'credentials' | 'profiles';

export class SnapDataSource<T> implements IDataSource<T> {
  constructor(
    private readonly account: string,
    private readonly STORAGE_KEY: StorageKey
  ) {}

  async load(): Promise<T[]> {
    throw new Error('Method not implemented.');
  }

  async save(key: string, value: T): Promise<void> {
    const data = await getSnapState(snap);
    data.accountState[this.account].polygonState[this.STORAGE_KEY][key] =
      value as any;
    await updateSnapState(snap, data);
  }

  async get(key: string): Promise<T | undefined> {
    const data = await getSnapState(snap);
    return data.accountState[this.account].polygonState[this.STORAGE_KEY][
      key
    ] as T;
  }

  async delete(key: string): Promise<void> {
    const data = await getSnapState(snap);
    delete data.accountState[this.account].polygonState[this.STORAGE_KEY][key];
    await updateSnapState(snap, data);
  }
}
