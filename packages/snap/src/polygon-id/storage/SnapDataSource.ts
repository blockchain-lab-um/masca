import { IDataSource } from '@0xpolygonid/js-sdk';
import { Blockchain, DidMethod, NetworkId } from '@iden3/js-iden3-core';

import StorageService from '../../storage/Storage.service';

type StorageKey = 'identities' | 'credentials' | 'profiles';

export class SnapDataSource<T> implements IDataSource<T> {
  constructor(
    private readonly account: string,
    private readonly method: DidMethod.Iden3 | DidMethod.PolygonId,
    private readonly blockchain: Blockchain.Ethereum | Blockchain.Polygon,
    private readonly networkId:
      | NetworkId.Main
      | NetworkId.Goerli
      | NetworkId.Mumbai,
    private readonly STORAGE_KEY: StorageKey
  ) {}

  async load(): Promise<T[]> {
    const data = StorageService.get();
    const base =
      data.accountState[this.account].polygon.state[this.method][
        this.blockchain
      ][this.networkId];

    return Object.values(base[this.STORAGE_KEY]).map(
      (val) => JSON.parse(val) as T
    );
  }

  async save(key: string, value: T): Promise<void> {
    const data = StorageService.get();
    const base =
      data.accountState[this.account].polygon.state[this.method][
        this.blockchain
      ][this.networkId];

    base[this.STORAGE_KEY][key] = JSON.stringify(value);
  }

  async get(key: string): Promise<T | undefined> {
    const data = StorageService.get();
    const base =
      data.accountState[this.account].polygon.state[this.method][
        this.blockchain
      ][this.networkId];
    return base[this.STORAGE_KEY][key]
      ? (JSON.parse(base[this.STORAGE_KEY][key]) as T)
      : undefined;
  }

  async delete(key: string): Promise<void> {
    const data = StorageService.get();
    const base =
      data.accountState[this.account].polygon.state[this.method][
        this.blockchain
      ][this.networkId];
    delete base[this.STORAGE_KEY][key];
  }
}
