import {
  getBIP44AddressKeyDeriver,
  BIP44CoinTypeNode,
} from '@metamask/key-tree';
import { ApiParams, SSISnapState } from 'src/interfaces';
import { getAccountIndex, setAccountIndex } from './snapUtils';
import { ethers } from 'ethers';
import { _hexToUint8Array } from './snapUtils';
import { didCoinTypeMappping } from '../constants/index';
import { SnapProvider } from '@metamask/snap-types';

export async function getAddressKeyDeriver(
  params: ApiParams,
  coin_type?: number
) {
  const { state, wallet, account } = params;
  if (coin_type === undefined) {
    const method = state.accountState[account].accountConfig.ssi.didMethod;
    console.log(didCoinTypeMappping[method]);
    coin_type = didCoinTypeMappping[method];
  }
  const bip44CoinTypeNode = (await wallet.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType: coin_type,
    },
  })) as BIP44CoinTypeNode;
  return bip44CoinTypeNode;
}

export async function getAddressKey(
  bip44Node: BIP44CoinTypeNode,
  addressIndex = 0
) {
  const keyDeriver = await getBIP44AddressKeyDeriver(bip44Node);
  const derivedKey = await keyDeriver(addressIndex);
  const privateKey = derivedKey.privateKey;
  const chainCode = derivedKey.chainCode;
  const addressKey = `0x${privateKey as string}${chainCode}`;
  if (privateKey === undefined) return null;
  return {
    privateKey: privateKey,
    originalAddressKey: addressKey,
    derivationPath: keyDeriver.path,
  };
}

export const snapGetKeysFromAddress = async (
  bip44Node: BIP44CoinTypeNode,
  state: SSISnapState,
  account: string,
  wallet: SnapProvider,
  maxScan = 20
): Promise<KeysType | null> => {
  let addressIndex;
  const index = getAccountIndex(state, account);
  if (index) {
    addressIndex = index;
    console.log(
      `getNextAddressIndex:\nFound address in state: ${addressIndex} ${account}`
    );
    return getKeysFromAddress(bip44Node, account, index);
  } else {
    const res = await getKeysFromAddress(
      bip44Node,
      account,
      undefined,
      maxScan
    );
    if (res) {
      await setAccountIndex(wallet, state, account, res?.addressIndex);
      return res;
    }
  }
  return null;
};

type KeysType = {
  privateKey: string;
  publicKey: string;
  address: string;
  addressIndex: number;
  derivationPath: string;
};

export const getKeysFromAddress = async (
  bip44Node: BIP44CoinTypeNode,
  account: string,
  index: number | undefined,
  maxScan = 20
): Promise<KeysType | null> => {
  if (index !== undefined) return getKeysFromAddressIndex(bip44Node, index);

  for (let i = 0; i < maxScan; i++) {
    const keys = await getKeysFromAddressIndex(bip44Node, i);
    if (keys && keys.address === account) return keys;
  }

  return null;
};

export const getKeysFromAddressIndex = async (
  bip44Node: BIP44CoinTypeNode,
  index: number | undefined
) => {
  if (typeof index === 'undefined') {
    throw new Error('Err, index undefined');
  }
  const addressIndex = index;
  if (isNaN(addressIndex) || addressIndex < 0) {
    console.log(`getKeysFromAddressIndex: addressIndex found: ${addressIndex}`);
  }

  const result = await getAddressKey(bip44Node, addressIndex);
  if (result === null) return null;
  const { privateKey, derivationPath } = result;
  const wallet = new ethers.Wallet(_hexToUint8Array(privateKey));

  return {
    privateKey: privateKey,
    publicKey: wallet.publicKey,
    address: wallet.address,
    addressIndex,
    derivationPath,
  };
};
