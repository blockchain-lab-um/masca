import { didCoinTypeMappping } from '@blockchain-lab-um/masca-types';
import {
  BIP44CoinTypeNode,
  getBIP44AddressKeyDeriver,
} from '@metamask/key-tree';
import type { SnapsGlobalObject } from '@metamask/snaps-types';
import { Wallet } from 'ethers';

import type { MascaState } from '../interfaces';
import { updateSnapState } from './stateUtils';

export async function setAccountIndex(
  snap: SnapsGlobalObject,
  state: MascaState,
  account: string,
  index: number
) {
  state.accountState[account].index = index;
  await updateSnapState(snap, state);
}
export async function getAddressKeyDeriver(
  params: {
    state: MascaState;
    snap: SnapsGlobalObject;
    account: string;
  },
  coin_type?: number
) {
  let ct = coin_type;
  const { state, snap, account } = params;
  if (ct === undefined) {
    const method = state.accountState[account].accountConfig.ssi.didMethod;
    ct = didCoinTypeMappping[method];
  }
  const bip44CoinTypeNode = (await snap.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType: ct,
    },
  })) as BIP44CoinTypeNode;
  return bip44CoinTypeNode;
}

export const getKeysFromAddressIndex = async (
  bip44CoinTypeNode: BIP44CoinTypeNode,
  addressIndex: number
): Promise<KeysType> => {
  const keyDeriver = await getBIP44AddressKeyDeriver(bip44CoinTypeNode);
  const derivedKey = await keyDeriver(addressIndex);

  const { privateKey } = derivedKey;
  if (privateKey === undefined) throw new Error('Failed to derive keys');

  const snap = new Wallet(privateKey);

  return {
    privateKey,
    publicKey: snap.signingKey.publicKey,
    address: snap.address,
    addressIndex,
    derivationPath: keyDeriver.path,
  };
};

export const snapGetKeysFromAddress = async (
  bip44CoinTypeNode: BIP44CoinTypeNode,
  state: MascaState,
  account: string,
  snap: SnapsGlobalObject,
  maxScan = 20
): Promise<KeysType> => {
  const addressIndex = state.accountState[account].index;

  // Get keys from address index
  if (typeof addressIndex === 'number') {
    return getKeysFromAddressIndex(bip44CoinTypeNode, addressIndex);
  }

  // Search for keys that match the current address
  for (let i = 0; i < maxScan; i += 1) {
    const keys = await getKeysFromAddressIndex(bip44CoinTypeNode, i);
    if (keys && keys.address.toUpperCase() === account.toUpperCase()) {
      await setAccountIndex(snap, state, account, i);
      return keys;
    }
  }

  throw new Error('Failed to get keys');
};

type KeysType = {
  privateKey: string;
  publicKey: string;
  address: string;
  addressIndex: number;
  derivationPath: string;
};
