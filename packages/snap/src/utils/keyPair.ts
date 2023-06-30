import {
  methodIndexMapping,
  type InternalSigMethods,
  type MascaState,
} from '@blockchain-lab-um/masca-types';
import {
  getBIP44AddressKeyDeriver,
  type BIP44CoinTypeNode,
} from '@metamask/key-tree';
import type { SnapsGlobalObject } from '@metamask/snaps-types';
import { Wallet } from 'ethers';

export async function getAccountIndexFromEntropy(params: {
  snap: SnapsGlobalObject;
  account: string;
}): Promise<number> {
  const { snap, account } = params;
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

export async function getAddressKeyDeriver(params: {
  state: MascaState;
  snap: SnapsGlobalObject;
  account: string;
}) {
  const { snap } = params;
  const bip44CoinTypeNode = (await snap.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType: 1236,
    },
  })) as BIP44CoinTypeNode;

  return bip44CoinTypeNode;
}

export async function getAddressKeyPair(params: {
  bip44CoinTypeNode: BIP44CoinTypeNode;
  accountIndex: number;
  method: InternalSigMethods;
}) {
  const { bip44CoinTypeNode, accountIndex, method } = params;
  const keyDeriver = await getBIP44AddressKeyDeriver(bip44CoinTypeNode, {
    account: accountIndex,
  });
  const derivedKey = await keyDeriver(methodIndexMapping[method]);
  const { privateKey, chainCode } = derivedKey;
  const addressKey = `${privateKey as string}${chainCode.split('0x')[1]}`;
  if (privateKey === undefined) return null;
  return {
    privateKey,
    originalAddressKey: addressKey,
    derivationPath: keyDeriver.path,
  };
}

export const getKeysFromAccountIndex = async (params: {
  bip44CoinTypeNode: BIP44CoinTypeNode;
  accountIndex: number | undefined;
  method: InternalSigMethods;
}): Promise<KeysType> => {
  const { bip44CoinTypeNode, accountIndex, method } = params;
  if (accountIndex === undefined) {
    throw new Error('addressIndex undefined');
  }

  const result = await getAddressKeyPair({
    bip44CoinTypeNode,
    accountIndex,
    method,
  });
  if (result === null) throw new Error("Couldn't derive key pair");
  const { privateKey, derivationPath } = result;
  const snap = new Wallet(privateKey);
  return {
    privateKey,
    publicKey: snap.signingKey.publicKey,
    address: snap.address,
    addressIndex: methodIndexMapping[method],
    accountIndex,
    derivationPath,
  };
};

export const snapGetKeysFromAddress = async (params: {
  snap: SnapsGlobalObject;
  bip44CoinTypeNode: BIP44CoinTypeNode;
  account: string;
  state: MascaState;
}): Promise<KeysType | null> => {
  const { snap, bip44CoinTypeNode, account, state } = params;
  const method = state.accountState[account].accountConfig.ssi
    .didMethod as InternalSigMethods;
  const regex = /^0x[a-fA-F0-9]{40}$/;
  if (!regex.test(account)) return null;
  const accountIndex = await getAccountIndexFromEntropy({ snap, account });
  // FIXME: due to the entropy based derivation of the address index,
  // the address is not the same as the one currently selected account in metamask
  const keys = await getKeysFromAccountIndex({
    bip44CoinTypeNode,
    accountIndex,
    method,
  });
  keys.address = account;
  return keys;
};

type KeysType = {
  privateKey: string;
  publicKey: string;
  address: string;
  accountIndex: number;
  addressIndex?: number;
  derivationPath: string;
};
