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

import EthereumService from './Ethereum.service';
import StorageService from './storage/Storage.service';
import UIService from './UI.service';
import { validateSession } from './utils/ceramicUtils';
import { getEmptyAccountState } from './utils/config';

class GeneralService {
  static async initAccountState(): Promise<void> {
    const state = StorageService.get();

    if (!state.currentAccount) {
      throw Error(
        'No current account set. Please call the `setCurrentAccount` RPC method first.'
      );
    }

    if (!(state.currentAccount in state.accountState)) {
      state.accountState[state.currentAccount] = getEmptyAccountState();
    }
  }

  static async setCurrentAccount(account: string): Promise<void> {
    const state = StorageService.get();
    state.currentAccount = account;
  }

  /**
   * Function that lets you add a friendly dApp
   *
   * @param dapp - dApp to add to the friendly dApps list.
   *
   * @returns void
   */
  static async addFriendlyDapp(dapp: string): Promise<void> {
    const state = StorageService.get();
    if (state.snapConfig.dApp.friendlyDapps.includes(dapp)) return;
    if (!(await UIService.addFriendlyDappDialog(dapp))) {
      throw new Error('User rejected friendly dApp addition');
    }
    state.snapConfig.dApp.friendlyDapps.push(dapp);
  }

  /**
   * Function that lets you remove a friendly dApp
   *
   * @param dapp - dApp to remove from the friendly dApps list.
   *
   * @returns void
   */
  static async removeFriendlyDapp(args: { id: string }): Promise<void> {
    if (!(await UIService.removeFriendlyDappDialog(args.id))) {
      throw new Error('User rejected friendly dApp removal');
    }

    const state = StorageService.get();
    state.snapConfig.dApp.friendlyDapps =
      state.snapConfig.dApp.friendlyDapps.filter((d) => d !== args.id);
  }

  /**
   * Function that checks if a dApp is friendly
   *
   * @param dapp - dApp to check.
   *
   * @returns boolean - whether the dApp is friendly.
   */
  static async isFriendlyDapp(dapp: string): Promise<boolean> {
    const state = StorageService.get();
    return state.snapConfig.dApp.friendlyDapps.includes(dapp);
  }

  /**
   * Function that toggles the disablePopups flag.
   *
   * @returns void
   */
  static async togglePopups(): Promise<boolean> {
    const state = StorageService.get();

    if (!state.snapConfig.dApp.disablePopups) {
      if (await UIService.togglePopupsDialog()) {
        state.snapConfig.dApp.disablePopups = true;
        return state.snapConfig.dApp.disablePopups;
      }
      throw new Error('User rejected popup toggle');
    } else {
      state.snapConfig.dApp.disablePopups = false;
      return state.snapConfig.dApp.disablePopups;
    }
  }

  static async switchDIDMethod(args: SwitchMethodRequestParams): Promise<void> {
    const state = StorageService.get();
    const currentMethod =
      state.accountState[state.currentAccount].accountConfig.ssi.didMethod;
    const newMethod = args.didMethod;

    if (requiresNetwork(newMethod)) {
      await EthereumService.handleNetwork({
        didMethod: newMethod as MethodsRequiringNetwork,
      });
    }

    if (currentMethod !== newMethod) {
      state.accountState[state.currentAccount].accountConfig.ssi.didMethod =
        newMethod;
      return;
    }
    throw new Error('Method already set');
  }

  static async getSelectedMethod(): Promise<string> {
    const state = StorageService.get();
    return state.accountState[state.currentAccount].accountConfig.ssi.didMethod;
  }

  static async getVCStore(): Promise<Record<AvailableVCStores, boolean>> {
    const state = StorageService.get();
    return state.accountState[state.currentAccount].accountConfig.ssi.vcStore;
  }

  static async setVCStore(args: SetVCStoreRequestParams): Promise<boolean> {
    const state = StorageService.get();
    const { store, value } = args;

    if (store !== 'snap') {
      state.accountState[state.currentAccount].accountConfig.ssi.vcStore[
        store
      ] = value;

      return true;
    }
    return false;
  }

  static async getEnabledVCStores(): Promise<AvailableVCStores[]> {
    const state = StorageService.get();

    return Object.entries(
      state.accountState[state.currentAccount].accountConfig.ssi.vcStore
    )
      .filter(([, value]) => value)
      .map(([key]) => key) as AvailableVCStores[];
  }

  static async getAvailableVCStores(): Promise<string[]> {
    return availableVCStores.map((store) => store);
  }

  static async getAccountSettings(): Promise<MascaAccountConfig> {
    const state = StorageService.get();
    return state.accountState[state.currentAccount].accountConfig;
  }

  static async getSnapSettings(): Promise<MascaConfig> {
    const state = StorageService.get();
    return state.snapConfig;
  }

  static async getAvailableMethods(): Promise<string[]> {
    return availableMethods.map((method: string) => method);
  }

  static async setCeramicSession(args: {
    serializedSession: string;
  }): Promise<void> {
    const state = StorageService.get();
    state.accountState[state.currentAccount].ceramicSession =
      args.serializedSession;
  }

  static async validateStoredCeramicSession(): Promise<string> {
    const state = StorageService.get();

    const serializedSession = await validateSession(
      state.accountState[state.currentAccount].ceramicSession
    );

    return serializedSession;
  }
}

export default GeneralService;
