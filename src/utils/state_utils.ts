import {
  Wallet,
  State,
  SSISnapState,
  SSIAccountState,
  SSISnapConfig,
} from "../interfaces";
import { getCurrentAccount } from "./snap_utils";
declare let wallet: Wallet;

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
  let state = (await wallet.request({
    method: "snap_manageState",
    params: ["get"],
  })) as State | null;
  if (state != null) {
    if ("ssiSnapState" in state) {
      return state.ssiSnapState as SSISnapState;
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
  let ssiSnapState = await getVCState();
  const address = await getCurrentAccount();
  if (address in ssiSnapState) {
    return ssiSnapState[address];
  } else {
    const emptyVCAccountDecrypted = await initializeVCAccount(address);
    return emptyVCAccountDecrypted;
  }
}
/**
 * Function that returns config object of SSI Snap
 *
 * @returns {SSISnapConfig} object
 */
export async function getConfig(): Promise<SSISnapConfig> {
  let ssiSnapState = await getVCState();
  if ("config" in ssiSnapState) {
    return ssiSnapState.config;
  } else {
    const config = {
      infuraToken: "6e751a2e5ff741e5a01eab15e4e4a88b",
      store: "snap",
    } as SSISnapConfig;
    await updateConfig(config);
    return config;
  }
}

/**
 * Updates config object in MetaMask state with new object.
 *
 * @param {SSISnapConfig} config object that will replace the current object in the state
 */
export async function updateConfig(config: SSISnapConfig) {
  let ssiSnapState = await getVCState();
  ssiSnapState.config = config;
  await updateVCState(ssiSnapState);
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
  let ssiSnapState = await getVCState();
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
  const emptyVCAccountDecrypted = {
    snapKeyStore: {},
    snapPrivateKeyStore: {},
    vcs: [],
    identifiers: {},
  } as SSIAccountState;
  let ssiSnapState = await getVCState();
  ssiSnapState[address] = emptyVCAccountDecrypted;
  await updateVCState(ssiSnapState);
  return emptyVCAccountDecrypted;
}
