import {
  State,
  SSISnapState,
  SSIAccountState,
  SSISnapConfig,
  SSIAccountConfig,
} from "../interfaces";
import { getCurrentAccount } from "./snap_utils";
import { defaultConfig, emptyVCAccount } from "./config";

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

async function updateVCState(snapState: SSISnapState) {
  let state = (await wallet.request({
    method: "snap_manageState",
    params: ["get"],
  })) as State | null;
  if (state != null) {
    state.ssiSnapState = snapState;
    await wallet.request({
      method: "snap_manageState",
      params: ["update", state],
    });
  } else {
    state = { ssiSnapState: snapState };
    await wallet.request({
      method: "snap_manageState",
      params: ["update", state],
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
async function getVCState(): Promise<SSISnapState> {
  const state = (await wallet.request({
    method: "snap_manageState",
    params: ["get"],
  })) as State | null;
  if (state != null) {
    if ("ssiSnapState" in state) {
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
export async function getVCAccount(): Promise<SSIAccountState> {
  const ssiSnapState = await getVCState();
  const address = await getCurrentAccount();
  if (address in ssiSnapState) {
    return ssiSnapState[address];
  } else {
    const emptyVCAccount = await initializeVCAccount(address);
    return emptyVCAccount;
  }
}
/**
 * Function that returns config object of SSI Snap
 *
 * @returns {SSISnapConfig} object
 */
export async function getSnapConfig(): Promise<SSISnapConfig> {
  const ssiSnapState = await getVCState();
  if ("snapConfig" in ssiSnapState) {
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
  const ssiSnapState = await getVCState();
  ssiSnapState.snapConfig = config;
  await updateVCState(ssiSnapState);
}

export async function getAccountConfig(): Promise<SSIAccountConfig> {
  const ssiAccountState = await getVCAccount();
  if ("accountConfig" in ssiAccountState) {
    return ssiAccountState.accountConfig;
  } else {
    await updateAccountConfig(emptyVCAccount.accountConfig);
    return JSON.parse(
      JSON.stringify(emptyVCAccount.accountConfig)
    ) as SSIAccountConfig;
  }
}

export async function updateAccountConfig(config: SSIAccountConfig) {
  const ssiAccountState = await getVCAccount();
  ssiAccountState.accountConfig = config;
  await updateVCAccount(ssiAccountState);
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
export async function updateVCAccount(data: SSIAccountState) {
  const address = await getCurrentAccount();
  const ssiSnapState = await getVCState();
  ssiSnapState[address] = data;
  await updateVCState(ssiSnapState);
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
async function initializeVCAccount(address: string): Promise<SSIAccountState> {
  const ssiSnapState = await getVCState();
  ssiSnapState[address] = emptyVCAccount;
  await updateVCState(ssiSnapState);
  return JSON.parse(JSON.stringify(emptyVCAccount)) as SSIAccountState;
}
