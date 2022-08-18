import {
  State,
  SSISnapState,
  SSIAccountState,
  SSISnapConfig,
  SSIAccountConfig,
} from '../interfaces';
import { getCurrentAccount } from './snapUtils';
import { defaultConfig, emptyVCAccount } from './config';

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

async function updateSnapState(snapState: SSISnapState) {
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
async function getSnapState(): Promise<SSISnapState> {
  const state = (await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  })) as State | null;
  if (state != null) {
    if ('ssiSnapState' in state) {
      return state.ssiSnapState;
    } else return {} as SSISnapState;
  } else return {} as SSISnapState;
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
export async function getAccountState(): Promise<SSIAccountState> {
  const ssiSnapState = await getSnapState();
  const address = await getCurrentAccount();
  if (address in ssiSnapState) {
    return ssiSnapState[address];
  } else {
    const emptyVCAccount = await initAccountState(address);
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
export async function updateAccountState(data: SSIAccountState) {
  const address = await getCurrentAccount();
  const ssiSnapState = await getSnapState();
  ssiSnapState[address] = data;
  await updateSnapState(ssiSnapState);
}

/**
 * Function that returns config object of SSI Snap
 *
 * @returns {SSISnapConfig} object
 */
export async function getSnapConfig(): Promise<SSISnapConfig> {
  const ssiSnapState = await getSnapState();
  if ('snapConfig' in ssiSnapState) {
    return ssiSnapState.snapConfig;
  } else {
    await updateSnapConfig(defaultConfig);
    return JSON.parse(JSON.stringify(defaultConfig)) as SSISnapConfig;
  }
}

/**
 * Updates config object in MetaMask state with new object.
 *
 * @param {SSISnapConfig} config object that will replace the current object in the state
 */
export async function updateSnapConfig(config: SSISnapConfig) {
  const ssiSnapState = await getSnapState();
  ssiSnapState.snapConfig = config;
  await updateSnapState(ssiSnapState);
}

export async function getAccountConfig(): Promise<SSIAccountConfig> {
  const ssiAccountState = await getAccountState();
  if ('accountConfig' in ssiAccountState) {
    return ssiAccountState.accountConfig;
  } else {
    await updateAccountConfig(emptyVCAccount.accountConfig);
    return JSON.parse(
      JSON.stringify(emptyVCAccount.accountConfig)
    ) as SSIAccountConfig;
  }
}

export async function updateAccountConfig(config: SSIAccountConfig) {
  const ssiAccountState = await getAccountState();
  ssiAccountState.accountConfig = config;
  await updateAccountState(ssiAccountState);
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
async function initAccountState(address: string): Promise<SSIAccountState> {
  const ssiSnapState = await getSnapState();
  ssiSnapState[address] = emptyVCAccount;
  await updateSnapState(ssiSnapState);
  return JSON.parse(JSON.stringify(emptyVCAccount)) as SSIAccountState;
}
