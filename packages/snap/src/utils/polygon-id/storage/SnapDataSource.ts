import { IDataSource } from '@0xpolygonid/js-sdk';
import { Blockchain, DidMethod, NetworkId } from '@iden3/js-iden3-core';

import { getSnapState, updateSnapState } from '../../stateUtils';

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
    const data = await getSnapState(snap);
    const base =
      data.accountState[this.account].polygonState[this.method][
        this.blockchain
      ][this.networkId];

    return Object.values(base[this.STORAGE_KEY]) as T[];
  }

  async save(key: string, value: T): Promise<void> {
    const data = await getSnapState(snap);
    const base =
      data.accountState[this.account].polygonState[this.method][
        this.blockchain
      ][this.networkId];
    base[this.STORAGE_KEY][key] = value as any;
    await updateSnapState(snap, data);
  }

  async get(key: string): Promise<T | undefined> {
    const data = await getSnapState(snap);
    const base =
      data.accountState[this.account].polygonState[this.method][
        this.blockchain
      ][this.networkId];
    return base[this.STORAGE_KEY][key] as T;
  }

  async delete(key: string): Promise<void> {
    const data = await getSnapState(snap);
    const base =
      data.accountState[this.account].polygonState[this.method][
        this.blockchain
      ][this.networkId];
    delete base[this.STORAGE_KEY][key];
    await updateSnapState(snap, data);
  }
}
