import { didCoinTypeMappping } from '@blockchain-lab-um/masca-types';
import {
  BIP44CoinTypeNode,
  getBIP44AddressKeyDeriver,
} from '@metamask/key-tree';
import { SnapsGlobalObject } from '@metamask/snaps-types';
import { Wallet } from 'ethers';

import { MascaState } from '../interfaces';

/**
 * Function that returns the address index used in Masca, derived from the snap's entropy for the passed account.
 *
 * @param params - object containing the account to get the index for.
 * @param params.account - account to get the index for.
 *
 * @returns number - address index.
 *
 * The returned index is used to derive private keys for the account.
 */
export async function getAddressIndexFromEntropy(params: {
  account: string;
}): Promise<number> {
  const { account } = params;
  const entropy = await snap.request({
    method: 'snap_getEntropy',
    params: {
      version: 1,
      salt: account,
    },
  });
  // eslint-disable-next-line no-bitwise
  const index = parseInt(entropy.slice(-8), 16) >>> 1;
  return index;
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

  // FIXME: in future coinType 60 will be rejected when passed to this method
  const bip44CoinTypeNode = (await snap.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType: ct,
    },
  })) as BIP44CoinTypeNode;
  return bip44CoinTypeNode;
}

export async function getAddressKeyPair(params: {
  bip44CoinTypeNode: BIP44CoinTypeNode;
  addressIndex: number;
}) {
  const { bip44CoinTypeNode, addressIndex } = params;
  const keyDeriver = await getBIP44AddressKeyDeriver(bip44CoinTypeNode);
  const derivedKey = await keyDeriver(addressIndex);
  const { privateKey, chainCode } = derivedKey;
  const addressKey = `${privateKey as string}${chainCode.split('0x')[1]}`;
  if (privateKey === undefined) return null;
  return {
    privateKey,
    originalAddressKey: addressKey,
    derivationPath: keyDeriver.path,
  };
}

export const getKeysFromAddressIndex = async (params: {
  bip44CoinTypeNode: BIP44CoinTypeNode;
  addressIndex: number | undefined;
}) => {
  const { bip44CoinTypeNode, addressIndex } = params;
  if (addressIndex === undefined) {
    throw new Error('addressIndex undefined');
  }

  const result = await getAddressKeyPair({ bip44CoinTypeNode, addressIndex });
  if (result === null) throw new Error("Couldn't derive key pair");
  const { privateKey, derivationPath } = result;
  const snap = new Wallet(privateKey);

  return {
    privateKey,
    publicKey: snap.signingKey.publicKey,
    address: snap.address,
    addressIndex,
    derivationPath,
  };
};

export const snapGetKeysFromAddress = async (params: {
  bip44CoinTypeNode: BIP44CoinTypeNode;
  account: string;
}): Promise<KeysType | null> => {
  const { bip44CoinTypeNode, account } = params;
  const addressIndex = await getAddressIndexFromEntropy({ account });
  const keys = await getKeysFromAddressIndex({
    bip44CoinTypeNode,
    addressIndex,
  });
  return keys;
};

type KeysType = {
  privateKey: string;
  publicKey: string;
  address: string;
  addressIndex: number;
  derivationPath: string;
};
