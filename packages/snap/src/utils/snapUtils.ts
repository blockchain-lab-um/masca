import { updateSnapState } from './stateUtils';
import { publicKeyConvert } from 'secp256k1';
import { SnapsGlobalObject } from '@metamask/snaps-types';
import { ApiParams, SnapConfirmParams, SSISnapState } from '../interfaces';
import { snapGetKeysFromAddress } from './keyPair';
import { BIP44CoinTypeNode } from '@metamask/key-tree';
import { keccak256 } from 'ethers/lib/utils';
import { AvailableVCStores } from '@blockchain-lab-um/ssi-snap-types';

/**
 * Function that returns address of the currently selected MetaMask account.
 *
 * @private
 *
 * @returns {Promise<string>} address - MetaMask address
 *
 * @beta
 *
 **/
export async function getCurrentAccount(
  snap: SnapsGlobalObject
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
  snap: SnapsGlobalObject
): Promise<string> {
  const network = (await ethereum.request({
    method: 'eth_chainId',
  })) as string;
  return network;
}

/**
 * Function that replaces default Infura Token with @param token.
 *
 * @param state SSISnapState
 * @param token infura token
 */
export async function updateInfuraToken(
  snap: SnapsGlobalObject,
  state: SSISnapState,
  token: string
): Promise<void> {
  state.snapConfig.snap.infuraToken = token;
  await updateSnapState(snap, state);
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
  // FIXME: TEST IF YOU CAN REFERENCE FRIENDLY DAPS
  // let friendlyDapps = state.snapConfig.dApp.friendlyDapps;
  // friendlyDapps = friendlyDapps.filter((d) => d !== dapp);
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
  return Buffer.from(arr).toString('hex');
}

export function _hexToUint8Array(str: string): Uint8Array {
  return new Uint8Array(Buffer.from(str, 'hex'));
}

/*export function keccak(data: Uint8Array): Uint8Array {
  return new Uint8Array(sha3.keccak_256.arrayBuffer(data));
}*/

export function toEthereumAddress(hexPublicKey: string): string {
  return keccak256(_hexToUint8Array(hexPublicKey)).slice(26);
}

export async function snapConfirm(
  snap: SnapsGlobalObject,
  params: SnapConfirmParams
): Promise<boolean> {
  return (await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'Confirmation',
      fields: {
        title: params.prompt,
        description: params.description,
        textAreaContent: params.textAreaContent,
      },
    },
  })) as boolean;
}

export function getAccountIndex(
  state: SSISnapState,
  account: string
): number | undefined {
  if (state.accountState[account].index)
    return state.accountState[account].index;
  else return undefined;
}

export async function setAccountIndex(
  snap: SnapsGlobalObject,
  state: SSISnapState,
  account: string,
  index: number
) {
  state.accountState[account].index = index;
  await updateSnapState(snap, state);
}

export function getEnabledVCStores(
  account: string,
  state: SSISnapState,
  vcstores?: AvailableVCStores[]
): string[] {
  if (!vcstores) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    vcstores = Object.keys(
      state.accountState[account].accountConfig.ssi.vcStore
    ) as AvailableVCStores[];
  }

  const res = vcstores.filter((vcstore) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return state.accountState[account].accountConfig.ssi.vcStore[store];
}
