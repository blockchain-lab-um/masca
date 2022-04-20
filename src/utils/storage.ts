import { Wallet, State, SSISnapState, SSIAccountState } from "../interfaces";

declare let wallet: Wallet;

/**
 * Internal function for updating the VCSnap object in MetaMask state
 * This function will only update state for the VCSnap and will not interfere with the state, set by other snaps
 *
 * @private
 *
 * @param vcState - {VCState} object to replace the current object in the MetaMask state.
 *
 * @beta
 *
 **/

async function updateVCState(vcState: SSISnapState) {
  let state = (await wallet.request({
    method: "snap_manageState",
    params: ["get"],
  })) as State | null;

  if (state != null) {
    state.ssiSnapState = vcState;
    await wallet.request({
      method: "snap_manageState",
      params: ["update", state],
    });
  } else {
    state = { ssiSnapState: vcState };
    await wallet.request({
      method: "snap_manageState",
      params: ["update", state],
    });
  }
}

/**
 * Internal function to retrieve VCState object from the MetaMask state
 *
 * @private
 *
 * @returns @interface VCState object from the state
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
 * Function that returns a promise of the VCStateAccount object in the SSI Snap state for the selected MetaMask account.
 *
 * @public
 *
 * @returns  {VCStateAccount} object for the selected MetaMask account
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
 * Function that updates the object (VCStateAccount) in MetaMask SSI Snap state for the selected MetaMask account
 *
 * @public
 *
 * @param data {VCStateAccount} object that will replace the current object in the state
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
 * Function that creates an empty VCStateAccount object in the SSI Snap state for the provided address.
 *
 * @private
 *
 * @param address - MetaMask address
 *
 * @returns {VCStateAccount} - empty VCStateAccount object
 *
 * @beta
 *
 **/
async function initializeVCAccount(address): Promise<SSIAccountState> {
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

/**
 * Function that returns address of the currently selected MetaMask account.
 *
 * @private
 *
 * @returns {string} address - MetaMask address
 *
 * @beta
 *
 **/
async function getCurrentAccount(): Promise<string> {
  try {
    let accounts = (await wallet.request({
      method: "eth_requestAccounts",
    })) as Array<string>;
    const account = accounts[0];
    return account;
  } catch (e) {
    console.log(e);
    return "0x0";
  }
}
