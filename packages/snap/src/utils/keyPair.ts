import {
  getBIP44AddressKeyDeriver,
  BIP44CoinTypeNode,
} from '@metamask/key-tree';
import { ApiParams, SSISnapState } from 'src/interfaces';
import { getAccountIndex, setAccountIndex } from './snapUtils';
import { ethers } from 'ethers';
import { didCoinTypeMappping } from '@blockchain-lab-um/ssi-snap-types';
import { SnapProvider } from '@metamask/snap-types';

export async function getAddressKeyDeriver(
  params: ApiParams,
  coin_type?: number
) {
  const { state, wallet, account } = params;
  if (coin_type === undefined) {
    const method = state.accountState[account].accountConfig.ssi.didMethod;
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
  bip44CoinTypeNode: BIP44CoinTypeNode,
  addressIndex = 0
) {
  const keyDeriver = await getBIP44AddressKeyDeriver(bip44CoinTypeNode);
  const derivedKey = await keyDeriver(addressIndex);
  const privateKey = derivedKey.privateKey;
  const chainCode = derivedKey.chainCode;
  const addressKey = `${privateKey as string}${chainCode.split('0x')[1]}`;
  if (privateKey === undefined) return null;
  return {
    privateKey: privateKey,
    originalAddressKey: addressKey,
    derivationPath: keyDeriver.path,
  };
}

export const snapGetKeysFromAddress = async (
  bip44CoinTypeNode: BIP44CoinTypeNode,
  state: SSISnapState,
  account: string,
  wallet: SnapProvider,
  maxScan = 20
): Promise<KeysType | null> => {
  const addressIndex = getAccountIndex(state, account);
  if (addressIndex) {
    return getKeysFromAddress(
      bip44CoinTypeNode,
      account,
      maxScan,
      addressIndex
    );
  } else {
    const res = await getKeysFromAddress(bip44CoinTypeNode, account, maxScan);
    if (res) {
      await setAccountIndex(wallet, state, account, res.addressIndex);
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
  bip44CoinTypeNode: BIP44CoinTypeNode,
  account: string,
  maxScan = 20,
  addressIndex?: number
): Promise<KeysType | null> => {
  if (addressIndex !== undefined)
    return getKeysFromAddressIndex(bip44CoinTypeNode, addressIndex);

  for (let i = 0; i < maxScan; i++) {
    const keys = await getKeysFromAddressIndex(bip44CoinTypeNode, i);
    if (keys && keys.address.toUpperCase() === account.toUpperCase())
      return keys;
  }

  return null;
};

export const getKeysFromAddressIndex = async (
  bip44CoinTypeNode: BIP44CoinTypeNode,
  addressIndex: number | undefined
) => {
  if (addressIndex === undefined) throw new Error('Err, index undefined');

  const result = await getAddressKey(bip44CoinTypeNode, addressIndex);
  if (result === null) return null;
  const { privateKey, derivationPath } = result;
  const wallet = new ethers.Wallet(privateKey);

  return {
    privateKey: privateKey,
    publicKey: wallet.publicKey,
    address: wallet.address,
    addressIndex: addressIndex,
    derivationPath,
  };
};
