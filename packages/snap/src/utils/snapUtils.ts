import { updateSnapState } from './stateUtils';
import { publicKeyConvert } from 'secp256k1';
import * as ethers from 'ethers';
import { SnapProvider } from '@metamask/snap-types';
import { SnapConfirmParams, SSISnapState } from '../interfaces';

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
  wallet: SnapProvider
): Promise<string | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const accounts = (await wallet.request({
      method: 'eth_requestAccounts',
    })) as Array<string>;
    console.log('MetaMask accounts', accounts);
    return accounts[0];
  } catch (e) {
    return null;
  }
}

export async function getCurrentNetwork(wallet: SnapProvider): Promise<string> {
  return (await wallet.request({
    method: 'eth_chainId',
  })) as string;
}

/**
 * Function that replaces default Infura Token with @param token.
 *
 * @param state SSISnapState
 * @param token infura token
 */
export async function updateInfuraToken(
  wallet: SnapProvider,
  state: SSISnapState,
  token: string
): Promise<void> {
  state.snapConfig.snap.infuraToken = token;
  await updateSnapState(wallet, state);
}

/**
 * Function that toggles the disablePopups flag in the config.
 *
 */
export async function togglePopups(wallet: SnapProvider, state: SSISnapState) {
  state.snapConfig.dApp.disablePopups = !state.snapConfig.dApp.disablePopups;
  await updateSnapState(wallet, state);
}

/**
 * Function that lets you add a friendly dApp
 *
 */
export async function addFriendlyDapp(
  wallet: SnapProvider,
  state: SSISnapState,
  dapp: string
) {
  state.snapConfig.dApp.friendlyDapps.push(dapp);
  await updateSnapState(wallet, state);
}

/**
 * Function that removes a friendly dApp.
 *
 */
export async function removeFriendlyDapp(
  wallet: SnapProvider,
  state: SSISnapState,
  dapp: string
) {
  // FIXME: TEST IF YOU CAN REFERENCE FRIENDLY DAPS
  // let friendlyDapps = state.snapConfig.dApp.friendlyDapps;
  // friendlyDapps = friendlyDapps.filter((d) => d !== dapp);
  state.snapConfig.dApp.friendlyDapps =
    state.snapConfig.dApp.friendlyDapps.filter((d) => d !== dapp);
  await updateSnapState(wallet, state);
}

/**
 *  Generate the public key for the current account using personal_sign.
 *
 * @returns {Promise<string>} - returns public key for current account
 */
export async function getPublicKey(
  wallet: SnapProvider,
  state: SSISnapState,
  account: string
): Promise<string> {
  if (state.accountState[account].publicKey !== '')
    return state.accountState[account].publicKey;

  let signedMsg;
  try {
    signedMsg = (await wallet.request({
      method: 'personal_sign',
      params: ['getPublicKey', account],
    })) as string;
  } catch (err) {
    throw new Error('User denied request');
  }

  const message = 'getPublicKey';
  const msgHash = ethers.utils.hashMessage(message);
  const msgHashBytes = ethers.utils.arrayify(msgHash);

  return ethers.utils.recoverPublicKey(msgHashBytes, signedMsg);
}

export function getCompressedPublicKey(publicKey: string): string {
  return _uint8ArrayToHex(
    publicKeyConvert(_hexToUnit8Array(publicKey.split('0x')[1]), true)
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function _uint8ArrayToHex(arr: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Buffer.from(arr).toString('hex');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function _hexToUnit8Array(str: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return new Uint8Array(Buffer.from(str, 'hex'));
}

export async function snapConfirm(
  wallet: SnapProvider,
  params: SnapConfirmParams
): Promise<boolean> {
  return (await wallet.request({
    method: 'snap_confirm',
    params: [params],
  })) as boolean;
}
