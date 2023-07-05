import { IDataSource } from "@0xpolygonid/js-sdk";
import { getSnapState, updateSnapState } from "../../stateUtils";

type SnapStorageKey = 'identities' | 'credentials' | 'profiles';

export class SnapDataSource<T> implements IDataSource<T> {
  private readonly snapStorageKey:SnapStorageKey;

  private account: string;

  constructor(_account: string, _snapStorageKey: SnapStorageKey) {
    this.snapStorageKey = _snapStorageKey;
    this.account = _account;
  }

  async load(): Promise<T[]> {
    throw new Error("Method not implemented.");
  }

  async save(key: string, value: T): Promise<void> {
    const data = await getSnapState(snap);
    data.accountState[this.account].polygonState[this.snapStorageKey][key] = value as any;
    await updateSnapState(snap, data);
  }

  async get(key: string): Promise<T | undefined> {
    const data = await getSnapState(snap);
    return data.accountState[this.account].polygonState[this.snapStorageKey][key] as T;
  }

  async delete(key: string): Promise<void> {
    const data = await getSnapState(snap);
    delete data.accountState[this.account].polygonState[this.snapStorageKey][key];
    await updateSnapState(snap, data);
  }

}
