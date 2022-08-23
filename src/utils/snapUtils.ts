import {
  getSnapConfig,
  updateSnapConfig,
  getAccountState,
  updateAccountState,
} from './stateUtils';
import { publicKeyConvert } from 'secp256k1';
import * as ethers from 'ethers';
import { SnapProvider } from '@metamask/snap-types';
import { Maybe } from '@metamask/providers/dist/utils';

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
export async function getCurrentAccount(wallet: SnapProvider): Promise<string> {
  try {
    const accounts = (await wallet.request({
      method: 'eth_requestAccounts',
    })) as Array<string>;
    console.log('MetaMask accounts', accounts);
    const account = accounts[0];
    return account;
  } catch (e) {
    console.log(e);
    return '0x0';
  }
}

export async function getCurrentNetwork(wallet: SnapProvider): Promise<string> {
  const chainId = (await wallet.request({
    method: 'eth_chainId',
  })) as string;
  return chainId;
}

/**
 * Function that replaces default Infura Token with @param token.
 *
 * @param token infura token
 */
export async function updateInfuraToken(wallet: SnapProvider, token: string) {
  const config = await getSnapConfig(wallet);
  config.snap.infuraToken = token;
  await updateSnapConfig(wallet, config);
  return;
}
/**
 * Function that toggles the disablePopups flag in the config.
 *
 */
export async function togglePopups(wallet: SnapProvider) {
  const config = await getSnapConfig(wallet);
  config.dApp.disablePopups = !config.dApp.disablePopups;
  await updateSnapConfig(wallet, config);
  return;
}
/**
 * Function that lets you add a friendly dApp
 */
export async function addFriendlyDapp(wallet: SnapProvider, dapp: string) {
  const config = await getSnapConfig(wallet);
  config.dApp.friendlyDapps.push(dapp);
  await updateSnapConfig(wallet, config);
  return;
}
/**
 * Function that removes a friendly dApp.
 *
 */
export async function removeFriendlyDapp(wallet: SnapProvider, dapp: string) {
  const config = await getSnapConfig(wallet);
  config.dApp.friendlyDapps = config.dApp.friendlyDapps.filter(
    (d) => d !== dapp
  );
  await updateSnapConfig(wallet, config);
  return;
}
/**
 * Function that returns a list of friendly dApps.
 *
 */
export async function getFriendlyDapps(
  wallet: SnapProvider
): Promise<Array<string>> {
  const config = await getSnapConfig(wallet);
  return config.dApp.friendlyDapps;
}

/**
 *  Generate the public key for the current account using personal_sign.
 *
 * @returns {Promise<string>} - returns public key for current account
 */
export async function getPublicKey(wallet: SnapProvider): Promise<string> {
  const vcAccount = await getAccountState(wallet);
  console.log(vcAccount);
  const account = await getCurrentAccount(wallet);
  let signedMsg;
  if (vcAccount.publicKey === '') {
    signedMsg = await wallet.request({
      method: 'personal_sign',
      params: ['getPublicKey', account],
    });
    if (!signedMsg || typeof signedMsg !== 'string')
      throw new Error('User denied request');

    const message = 'getPublicKey';
    const msgHash = ethers.utils.hashMessage(message);
    const msgHashBytes = ethers.utils.arrayify(msgHash);

    let pubKey = ethers.utils.recoverPublicKey(msgHashBytes, signedMsg);
    console.log(pubKey);

    pubKey = pubKey.split('0x')[1];
    console.log(pubKey);

    vcAccount.publicKey = pubKey;
    await updateAccountState(wallet, vcAccount);

    return pubKey;
  } else return vcAccount.publicKey;
}

export async function getCompressedPublicKey(
  wallet: SnapProvider
): Promise<string> {
  const publicKey = await getPublicKey(wallet);
  const compressedKey = _uint8ArrayToHex(
    publicKeyConvert(_hexToUnit8Array(publicKey), true)
  );
  return compressedKey;
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
  param: {
    prompt: string;
    description: string;
    textAreaContent: string;
  }
): Promise<Maybe<unknown>> {
  const result = await wallet.request({
    method: 'snap_confirm',
    params: [param],
  });
  return result;
}
