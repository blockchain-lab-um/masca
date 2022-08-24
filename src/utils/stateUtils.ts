import {
  State,
  SSISnapState,
  SSIAccountState,
  SSISnapConfig,
  SSIAccountConfig,
} from '../interfaces';
import { getCurrentAccount } from './snapUtils';
import { defaultConfig, emptyVCAccount } from './config';
import { SnapProvider } from '@metamask/snap-types';

/**
 * Internal function for updating SSISnapState object in the MetaMask state
 * This function will only update state for the SSISnapState and will not interfere with the state, set by other snaps
 *
 * @private
 *
 * @param {SSISnapState} snapState - object to replace the current object in the MetaMask state.
 *
 * @beta
 *
 **/
async function updateSnapState(wallet: SnapProvider, snapState: SSISnapState) {
  let state = (await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  })) as State | null;
  if (state != null) {
    state.ssiSnapState = snapState;
    await wallet.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  } else {
    state = { ssiSnapState: snapState };
    await wallet.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  }
}

/**
 * Internal function to retrieve SSISnapState object from the MetaMask state
 *
 * @private
 *
 * @returns {Promise<SSISnapState>} object from the state
 *
 * @beta
 *
 **/
async function getSnapState(wallet: SnapProvider): Promise<SSISnapState> {
  const state = (await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  })) as State | null;
  if (state != null) {
    if ('ssiSnapState' in state) {
      return state.ssiSnapState;
    } else return { accountState: {} } as SSISnapState;
  } else return { accountState: {} } as SSISnapState;
}

/**
 * Function that returns a promise of the SSIAccountState object in the SSI Snap state for the selected MetaMask account.
 *
 * @public
 *
 * @returns {Promise<SSIAccountState>} object for the selected MetaMask account
 *
 * @beta
 *
 **/
export async function getAccountState(
  wallet: SnapProvider
): Promise<SSIAccountState> {
  const ssiSnapState = await getSnapState(wallet);
  const address = await getCurrentAccount(wallet);
  if (address in ssiSnapState.accountState) {
    return ssiSnapState.accountState[address];
  } else {
    const emptyVCAccount = await initAccountState(wallet, address);
    return emptyVCAccount;
  }
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
  data: SSIAccountState
) {
  const address = await getCurrentAccount(wallet);
  const ssiSnapState = await getSnapState(wallet);
  ssiSnapState.accountState[address] = data;
  await updateSnapState(wallet, ssiSnapState);
}

/**
 * Function that returns config object of SSI Snap
 *
 * @returns {SSISnapConfig} object
 */
export async function getSnapConfig(
  wallet: SnapProvider
): Promise<SSISnapConfig> {
  const ssiSnapState = await getSnapState(wallet);
  if ('snapConfig' in ssiSnapState) {
    return ssiSnapState.snapConfig;
  } else {
    await updateSnapConfig(wallet, defaultConfig);
    return JSON.parse(JSON.stringify(defaultConfig)) as SSISnapConfig;
  }
}

/**
 * Updates config object in MetaMask state with new object.
 *
 * @param {SSISnapConfig} config object that will replace the current object in the state
 */
export async function updateSnapConfig(
  wallet: SnapProvider,
  config: SSISnapConfig
) {
  const ssiSnapState = await getSnapState(wallet);
  ssiSnapState.snapConfig = config;
  await updateSnapState(wallet, ssiSnapState);
}

export async function getAccountConfig(
  wallet: SnapProvider
): Promise<SSIAccountConfig> {
  const ssiAccountState = await getAccountState(wallet);
  if ('accountConfig' in ssiAccountState) {
    return ssiAccountState.accountConfig;
  } else {
    await updateAccountConfig(wallet, emptyVCAccount.accountConfig);
    return JSON.parse(
      JSON.stringify(emptyVCAccount.accountConfig)
    ) as SSIAccountConfig;
  }
}

export async function updateAccountConfig(
  wallet: SnapProvider,
  config: SSIAccountConfig
) {
  const ssiAccountState = await getAccountState(wallet);
  ssiAccountState.accountConfig = config;
  await updateAccountState(wallet, ssiAccountState);
}

/**
 * Function that creates an empty SSIAccountState object in the SSI Snap state for the provided address.
 *
 * @private
 *
 * @param {string} address - MetaMask address
 *
 * @returns {Promise<SSIAccountState>} - empty SSIAccountState object
 *
 * @beta
 *
 **/
async function initAccountState(
  wallet: SnapProvider,
  address: string
): Promise<SSIAccountState> {
  const ssiSnapState = await getSnapState(wallet);
  ssiSnapState.accountState[address] = emptyVCAccount;
  await updateSnapState(wallet, ssiSnapState);
  return JSON.parse(JSON.stringify(emptyVCAccount)) as SSIAccountState;
}
