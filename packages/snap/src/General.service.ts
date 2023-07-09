import { getEmptyAccountState } from './utils/config';
import {
  getSnapState,
  getSnapStateUnchecked,
  initSnapState,
  updateSnapState,
} from './utils/stateUtils';

class GeneralService {
  static async initState(): Promise<void> {
    let state = await getSnapStateUnchecked();
    if (!state) state = await initSnapState();
  }

  static async initAccountState(): Promise<void> {
    const state = await getSnapState();

    if (!state.currentAccount) {
      throw Error(
        'No current account set. Please call the `setCurrentAccount` RPC method first.'
      );
    }

    if (!state.accountState[state.currentAccount]) {
      state.accountState[state.currentAccount] = getEmptyAccountState();
      await updateSnapState(state);
    }
  }

  static async setCurrentAccount(account: string): Promise<void> {
    const state = await getSnapState();
    state.currentAccount = account;
    await updateSnapState(state);
  }

  /**
   * Function that lets you add a friendly dApp
   *
   * @param dapp - dApp to add to the friendly dApps list.
   *
   * @returns void
   */
  static async addFriendlyDapp(dapp: string): Promise<void> {
    const state = await getSnapState();
    if (state.snapConfig.dApp.friendlyDapps.includes(dapp)) return;
    state.snapConfig.dApp.friendlyDapps.push(dapp);
    await updateSnapState(state);
  }

  /**
   * Function that lets you remove a friendly dApp
   *
   * @param dapp - dApp to remove from the friendly dApps list.
   *
   * @returns void
   */
  static async removeFriendlyDapp(dapp: string): Promise<void> {
    const state = await getSnapState();
    state.snapConfig.dApp.friendlyDapps =
      state.snapConfig.dApp.friendlyDapps.filter((d) => d !== dapp);
    await updateSnapState(state);
  }

  /**
   * Function that checks if a dApp is friendly
   *
   * @param dapp - dApp to check.
   *
   * @returns boolean - whether the dApp is friendly.
   */
  static async isFriendlyDapp(dapp: string): Promise<boolean> {
    const state = await getSnapState();
    return state.snapConfig.dApp.friendlyDapps.includes(dapp);
  }
}

export default GeneralService;
