import { AbstractPrivateKeyStore } from '@0xpolygonid/js-sdk';

import { getSnapState, updateSnapState } from '../../stateUtils';

export class SnapStoragePrivateKeyStore implements AbstractPrivateKeyStore {
  static readonly storageKey = 'keystore';

  constructor(private readonly account: string) {}

  async get(args: { alias: string }): Promise<string> {
    const data = await getSnapState(snap);

    const privateKey =
      data.accountState[this.account].polygonState[
        SnapStoragePrivateKeyStore.storageKey
      ][args.alias];

    if (!privateKey.alias) {
      throw new Error('no key under given alias');
    }

    return privateKey.value;
  }

  async importKey(args: { alias: string; key: string }): Promise<void> {
    const data = await getSnapState(snap);

    data.accountState[this.account].polygonState[
      SnapStoragePrivateKeyStore.storageKey
    ][args.alias] = {
      alias: args.alias,
      value: args.key,
    };

    await updateSnapState(snap, data);
  }
}
