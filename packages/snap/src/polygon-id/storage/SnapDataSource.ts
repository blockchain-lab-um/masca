import type { IDataSource } from '@0xpolygonid/js-sdk';
import { CURRENT_STATE_VERSION } from '@blockchain-lab-um/masca-types';
import type {
  Blockchain,
  DidMethod,
  NetworkId,
} from '@blockchain-lab-um/masca-types';

import StorageService from '../../storage/Storage.service';

type StorageKey = 'identities' | 'credentials' | 'profiles';

export class SnapDataSource<T> implements IDataSource<T> {
  constructor(
    private readonly account: string,
    private readonly method: DidMethod.Iden3 | DidMethod.PolygonId,
    private readonly blockchain: Blockchain.Polygon,
    private readonly networkId: NetworkId.Main | NetworkId.Mumbai,
    private readonly STORAGE_KEY: StorageKey
  ) {}

  async load(): Promise<T[]> {
    const data = StorageService.get();
    const base =
      data[CURRENT_STATE_VERSION].accountState[this.account].polygon.state[
        this.method
      ][this.blockchain][this.networkId];

    return Object.values(base[this.STORAGE_KEY]).map(
      (val) => JSON.parse(val) as T
    );
  }

  async save(key: string, value: T): Promise<void> {
    const data = StorageService.get();
    const base =
      data[CURRENT_STATE_VERSION].accountState[this.account].polygon.state[
        this.method
      ][this.blockchain][this.networkId];

    base[this.STORAGE_KEY][key] = JSON.stringify(value);
  }

  async get(key: string): Promise<T | undefined> {
    const data = StorageService.get();
    const base =
      data[CURRENT_STATE_VERSION].accountState[this.account].polygon.state[
        this.method
      ][this.blockchain][this.networkId];
    return base[this.STORAGE_KEY][key]
      ? (JSON.parse(base[this.STORAGE_KEY][key]) as T)
      : undefined;
  }

  async delete(key: string): Promise<void> {
    const data = StorageService.get();
    const base =
      data[CURRENT_STATE_VERSION].accountState[this.account].polygon.state[
        this.method
      ][this.blockchain][this.networkId];
    delete base[this.STORAGE_KEY][key];
  }
}
