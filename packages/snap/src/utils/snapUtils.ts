/* eslint-disable no-param-reassign */
import { publicKeyConvert } from 'secp256k1';
import { SnapsGlobalObject } from '@metamask/snaps-types';
import { BIP44CoinTypeNode } from '@metamask/key-tree';
import { keccak256 } from 'ethers/lib/utils';
import { AvailableVCStores } from '@blockchain-lab-um/ssi-snap-types';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { snapGetKeysFromAddress } from './keyPair';
import { ApiParams, SnapConfirmParams, SSISnapState } from '../interfaces';
import { updateSnapState } from './stateUtils';

/**
 * Function that returns address of the currently selected MetaMask account.
 *
 * @private
 *
 * @returns {Promise<string>} address - MetaMask address
 *
 * @beta
 *
 * */
export async function getCurrentAccount(
  ethereum: MetaMaskInpageProvider
): Promise<string | null> {
  try {
    const accounts = (await ethereum.request({
      method: 'eth_requestAccounts',
    })) as Array<string>;
    return accounts[0];
  } catch (e) {
    return null;
  }
}

export async function getCurrentNetwork(
  ethereum: MetaMaskInpageProvider
): Promise<string> {
  const network = (await ethereum.request({
    method: 'eth_chainId',
  })) as string;
  return network;
}

/**
 * Function that toggles the disablePopups flag in the config.
 *
 */
export async function togglePopups(
  snap: SnapsGlobalObject,
  state: SSISnapState
) {
  state.snapConfig.dApp.disablePopups = !state.snapConfig.dApp.disablePopups;
  await updateSnapState(snap, state);
}

/**
 * Function that lets you add a friendly dApp
 *
 */
export async function addFriendlyDapp(
  snap: SnapsGlobalObject,
  state: SSISnapState,
  dapp: string
) {
  state.snapConfig.dApp.friendlyDapps.push(dapp);
  await updateSnapState(snap, state);
}

/**
 * Function that removes a friendly dApp.
 *
 */
export async function removeFriendlyDapp(
  snap: SnapsGlobalObject,
  state: SSISnapState,
  dapp: string
) {
  state.snapConfig.dApp.friendlyDapps =
    state.snapConfig.dApp.friendlyDapps.filter((d) => d !== dapp);
  await updateSnapState(snap, state);
}

/**
 *  Generate the public key for the current account using personal_sign.
 *
 * @returns {Promise<string>} - returns public key for current account
 */
export async function getPublicKey(params: ApiParams): Promise<string> {
  const { snap, state, account, bip44CoinTypeNode } = params;
  if (state.accountState[account].publicKey !== '')
    return state.accountState[account].publicKey;
  const res = await snapGetKeysFromAddress(
    bip44CoinTypeNode as BIP44CoinTypeNode,
    state,
    account,
    snap
  );
  if (res === null) throw new Error('Could not get keys from address');
  return res.publicKey;
}

<<<<<<< HEAD
export function getCompressedPublicKey(publicKey: string): string {
  return _uint8ArrayToHex(
    publicKeyConvert(_hexToUint8Array(publicKey.split('0x')[1]), true)
  );
}

export function getUncompressedPublicKey(publicKey: string): string {
  return _uint8ArrayToHex(publicKeyConvert(_hexToUint8Array(publicKey), false));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function _uint8ArrayToHex(arr: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
=======
export function uint8ArrayToHex(arr: Uint8Array) {
>>>>>>> 1ca018683d9c42bfca7172b686b256b26b733f8d
  return Buffer.from(arr).toString('hex');
}

export function hexToUint8Array(str: string): Uint8Array {
  return new Uint8Array(Buffer.from(str, 'hex'));
}
export function getCompressedPublicKey(publicKey: string): string {
  return uint8ArrayToHex(
    publicKeyConvert(hexToUint8Array(publicKey.split('0x')[1]), true)
  );
}

<<<<<<< HEAD
export function base64urlEncode(str: string): string {
  return Buffer.from(str).toString('base64url');
}

export function base64urlDecode(str: string): string {
  return Buffer.from(str, 'base64url').toString('utf8');
}

/*export function keccak(data: Uint8Array): Uint8Array {
  return new Uint8Array(sha3.keccak_256.arrayBuffer(data));
}*/

export function toEthereumAddress(hexPublicKey: string): string {
  return keccak256(_hexToUint8Array(hexPublicKey)).slice(26);
}

export async function snapConfirm(
=======
export function snapConfirm(
>>>>>>> 1ca018683d9c42bfca7172b686b256b26b733f8d
  snap: SnapsGlobalObject,
  params: SnapConfirmParams
): boolean {
  // return (await snap.request({
  //   method: 'snap_dialog',
  //   params: {
  //     type: 'Confirmation',
  //     fields: {
  //       title: params.prompt,
  //       description: params.description,
  //       textAreaContent: params.textAreaContent,
  //     },
  //   },
  // })) as boolean;
  return true;
}

export function getEnabledVCStores(
  account: string,
  state: SSISnapState,
  vcstores?: AvailableVCStores[]
): string[] {
  if (!vcstores) {
    vcstores = Object.keys(
      state.accountState[account].accountConfig.ssi.vcStore
    ) as AvailableVCStores[];
  }

  const res = vcstores.filter((vcstore) => {
    return (
      state.accountState[account].accountConfig.ssi.vcStore[vcstore] === true
    );
  });
  return res;
}

export function isEnabledVCStore(
  account: string,
  state: SSISnapState,
  store: AvailableVCStores
): boolean {
  return state.accountState[account].accountConfig.ssi.vcStore[store];
}

export async function setAccountPublicKey(params: ApiParams): Promise<void> {
  const { state, snap, account } = params;
  const publicKey = await getPublicKey(params);
  state.accountState[account].publicKey = publicKey;
  await updateSnapState(snap, state);
}
