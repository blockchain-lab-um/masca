import {
  SSISnapState,
  SSIAccountState,
  SSISnapConfig,
  SSIAccountConfig,
} from '../interfaces';
import { getCurrentAccount, getPublicKey } from './snapUtils';
import { getEmptyAccountState, getInitialSnapState } from './config';
import { SnapProvider } from '@metamask/snap-types';
import cloneDeep from 'lodash.clonedeep';

/**
 * Function for updating SSISnapState object in the MetaMask state
 *
 * @public
 *
 * @param {SSISnapState} snapState - object to replace the current object in the MetaMask state.
 *
 * @beta
 *
 **/
export async function updateSnapState(
  wallet: SnapProvider,
  snapState: SSISnapState
) {
  await wallet.request({
    method: 'snap_manageState',
    params: ['update', snapState],
  });
}

/**
 * Function to retrieve SSISnapState object from the MetaMask state
 *
 * @public
 *
 * @returns {Promise<SSISnapState>} object from the state
 *
 * @beta
 *
 **/
export async function getSnapState(
  wallet: SnapProvider
): Promise<SSISnapState> {
  const state = (await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  })) as SSISnapState | null;

  if (!state) throw Error('SSISnapState is not initialized!');
  return state;
}

/**
 * Function to retrieve SSISnapState object from the MetaMask state
 *
 * @public
 *
 * @returns {Promise<SSISnapState>} object from the state
 *
 * @beta
 *
 **/
export async function getSnapStateUnchecked(
  wallet: SnapProvider
): Promise<SSISnapState | null> {
  return (await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  })) as SSISnapState | null;
}

/**
 * Function to initialize SSISnapState object
 *
 * @public
 *
 * @returns {Promise<SSISnapState>} object
 *
 * @beta
 *
 **/
export async function initSnapState(
  wallet: SnapProvider
): Promise<SSISnapState> {
  const state = getInitialSnapState();
  await updateSnapState(wallet, state);
  return state;
}

/**
 * Function that creates an empty SSIAccountState object in the SSI Snap state for the provided address.
 *
 * @public
 *
 * @param {SSISnapState} state - SSISnapState
 * @param {string} account - MetaMask account
 *
 * @beta
 *
 **/
export async function initAccountState(
  wallet: SnapProvider,
  state: SSISnapState,
  account: string
): Promise<void> {
  state.accountState[account] = getEmptyAccountState();
  // FIXME: How to handle if user declines signature ?
  const publicKey = await getPublicKey(wallet, account);
  state.accountState[account].publicKey = publicKey;
  await updateSnapState(wallet, state);
}

/**
 * Function that updates the object (SSIAccountState) in MetaMask SSI Snap state for the selected MetaMask account
 *
 * @public
 *
 * @param {SSIAccountState} data object that will replace the current object in the state
 *
 * @beta
 *
 **/
export async function updateAccountState(
  wallet: SnapProvider,
  state: SSISnapState,
  address: string,
  data: SSIAccountState
) {
  state.accountState[address] = data;
  await updateSnapState(wallet, state);
}

// /**
//  * Function that returns config object of SSI Snap
//  *
//  * @returns {SSISnapConfig} object
//  */
// export async function getSnapConfig(
//   wallet: SnapProvider
// ): Promise<SSISnapConfig> {
//   const ssiSnapState = await getSnapState(wallet);
//   if ('snapConfig' in ssiSnapState) {
//     return ssiSnapState.snapConfig;
//   } else {
//     await updateSnapConfig(wallet, defaultConfig);
//     return JSON.parse(JSON.stringify(defaultConfig)) as SSISnapConfig;
//   }
// }

// /**
//  * Updates config object in MetaMask state with new object.
//  *
//  * @param {SSISnapConfig} config object that will replace the current object in the state
//  */
// export async function updateSnapConfig(
//   wallet: SnapProvider,
//   config: SSISnapConfig
// ) {
//   const ssiSnapState = await getSnapState(wallet);
//   ssiSnapState.snapConfig = config;
//   await updateSnapState(wallet, ssiSnapState);
// }

// export async function updateAccountConfig(
//   wallet: SnapProvider,
//   config: SSIAccountConfig
// ) {
//   const ssiAccountState = await getAccountState(wallet);
//   ssiAccountState.accountConfig = config;
//   await updateAccountState(wallet, ssiAccountState);
// }
