import {
  availableMethods,
  availableVCStores,
  AvailableVCStores,
  MascaAccountConfig,
  MascaConfig,
  MethodsRequiringNetwork,
  requiresNetwork,
  SetVCStoreRequestParams,
  SwitchMethodRequestParams,
} from '@blockchain-lab-um/masca-types';
import { divider, heading, panel, text } from '@metamask/snaps-ui';

import { handleNetwork } from './rpc/did/switchMethod';
import { validateSession } from './utils/ceramicUtils';
import { getEmptyAccountState, getInitialSnapState } from './utils/config';
import { snapConfirm } from './utils/snapUtils';
import {
  getSnapState,
  getSnapStateUnchecked,
  updateSnapState,
} from './utils/stateUtils';
import VeramoService from './veramo/Veramo.service';

class GeneralService {
  /**
   * Function that creates an empty MascaState object
   * if it is not already initialized.
   *
   * @returns void
   */
  static async initState(): Promise<void> {
    let state = await getSnapStateUnchecked();

    if (!state) {
      state = getInitialSnapState();
      await updateSnapState(state);
    }
  }

  /**
   * Function that creates an empty MascaAccountState object for
   * the currently selected account if it is not already initialized.
   *
   * @returns void
   */
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

  /**
   * Function that toggles the disablePopups flag.
   *
   * @returns void
   */
  static async togglePopups(): Promise<void> {
    const state = await getSnapState();
    state.snapConfig.dApp.disablePopups = !state.snapConfig.dApp.disablePopups;
    await updateSnapState(state);
  }

  static async switchDIDMethod(
    args: SwitchMethodRequestParams
  ): Promise<string> {
    const state = await getSnapState();
    const currentMethod =
      state.accountState[state.currentAccount].accountConfig.ssi.didMethod;
    const newMethod = args.didMethod;

    if (requiresNetwork(newMethod)) {
      await handleNetwork({ didMethod: newMethod as MethodsRequiringNetwork });
    }

    if (currentMethod !== newMethod) {
      const content = panel([
        heading('Switch Method'),
        text('Would you like to switch DID method?'),
        divider(),
        text(`Switching to: ${newMethod}`),
      ]);

      if (await snapConfirm(content)) {
        state.accountState[state.currentAccount].accountConfig.ssi.didMethod =
          newMethod;
        await updateSnapState(state);

        await VeramoService.init();
        const identifier = await VeramoService.getIdentifier();
        return identifier.did;
      }

      throw new Error('User rejected method switch');
    }

    throw new Error('Method already set');
  }

  static async getSelectedMethod(): Promise<string> {
    const state = await getSnapState();
    return state.accountState[state.currentAccount].accountConfig.ssi.didMethod;
  }

  static async getVCStore(): Promise<Record<AvailableVCStores, boolean>> {
    const state = await getSnapState();
    return state.accountState[state.currentAccount].accountConfig.ssi.vcStore;
  }

  static async setVCStore(args: SetVCStoreRequestParams): Promise<boolean> {
    const state = await getSnapState();
    const { store, value } = args;

    if (store !== 'snap') {
      const content = panel([
        heading('Manage VCStore Plugin'),
        text(`Would you like to ${value ? 'enable' : 'disable'} ${store}?`),
      ]);

      if (await snapConfirm(content)) {
        state.accountState[state.currentAccount].accountConfig.ssi.vcStore[
          store
        ] = value;

        await updateSnapState(state);
        return true;
      }
      return false;
    }
    return false;
  }

  static async getAvailableVCStores(): Promise<string[]> {
    return availableVCStores.map((store) => store);
  }

  static async getAccountSettings(): Promise<MascaAccountConfig> {
    const state = await getSnapState();
    return state.accountState[state.currentAccount].accountConfig;
  }

  static async getSnapSettings(): Promise<MascaConfig> {
    const state = await getSnapState();
    return state.snapConfig;
  }

  static async getAvailableMethods(): Promise<string[]> {
    return availableMethods.map((method: string) => method);
  }

  static async setCeramicSession(args: {
    serializedSession: string;
  }): Promise<void> {
    const state = await getSnapState();
    state.accountState[state.currentAccount].ceramicSession =
      args.serializedSession;
    await updateSnapState(state);
  }

  static async validateStoredCeramicSession(): Promise<string> {
    const state = await getSnapState();

    const serializedSession = await validateSession(
      state.accountState[state.currentAccount].ceramicSession
    );

    return serializedSession;
  }
}

export default GeneralService;
