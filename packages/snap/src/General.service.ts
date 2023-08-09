import {
  availableCredentialStores,
  AvailableCredentialStores,
  availableMethods,
  CURRENT_STATE_VERSION,
  MascaAccountConfig,
  MascaConfig,
  MethodsRequiringNetwork,
  requiresNetwork,
  SetCredentialStoreRequestParams,
  SwitchMethodRequestParams,
} from '@blockchain-lab-um/masca-types';

import EthereumService from './Ethereum.service';
import StorageService from './storage/Storage.service';
import UIService from './UI.service';
import { validateSession } from './utils/ceramicUtils';
import { getEmptyAccountState } from './utils/config';

class GeneralService {
  /**
   * Function that initializes an empty account state
   * @returns void
   */
  static async initAccountState(): Promise<void> {
    const state = StorageService.get();

    if (!state[CURRENT_STATE_VERSION].currentAccount) {
      throw Error(
        'No current account set. Please call the `setCurrentAccount` RPC method first.'
      );
    }

    if (
      !(
        state[CURRENT_STATE_VERSION].currentAccount in
        state[CURRENT_STATE_VERSION].accountState
      )
    ) {
      state[CURRENT_STATE_VERSION].accountState[
        state[CURRENT_STATE_VERSION].currentAccount
      ] = getEmptyAccountState();
    }
  }

  /**
   * Function that sets the current account
   * @param account - hex account string
   * @returns void
   */
  static async setCurrentAccount(account: string): Promise<void> {
    const state = StorageService.get();
    state[CURRENT_STATE_VERSION].currentAccount = account;
  }

  /**
   * Function that lets you add a friendly dApp
   * @param dapp - dApp to add to the friendly dApps list.
   * @returns void
   */
  static async addFriendlyDapp(dapp: string): Promise<void> {
    const state = StorageService.get();
    if (state[CURRENT_STATE_VERSION].config.dApp.friendlyDapps.includes(dapp))
      return;
    if (!(await UIService.addFriendlyDappDialog(dapp))) {
      throw new Error('User rejected friendly dApp addition');
    }
    state[CURRENT_STATE_VERSION].config.dApp.friendlyDapps.push(dapp);
  }

  /**
   * Function that lets you remove a friendly dApp
   * @param dapp - dApp to remove from the friendly dApps list.
   * @returns void
   */
  static async removeFriendlyDapp(args: { id: string }): Promise<void> {
    if (!(await UIService.removeFriendlyDappDialog(args.id))) {
      throw new Error('User rejected friendly dApp removal');
    }

    const state = StorageService.get();
    state[CURRENT_STATE_VERSION].config.dApp.friendlyDapps = state[
      CURRENT_STATE_VERSION
    ].config.dApp.friendlyDapps.filter((d) => d !== args.id);
  }

  /**
   * Function that checks if a dApp is friendly
   * @param dapp - dApp to check.
   * @returns boolean - whether the dApp is friendly.
   */
  static async isFriendlyDapp(dapp: string): Promise<boolean> {
    const state = StorageService.get();
    return state[CURRENT_STATE_VERSION].config.dApp.friendlyDapps.includes(
      dapp
    );
  }

  /**
   * Function that toggles the disablePopups flag.
   * @returns void
   */
  static async togglePopups(): Promise<boolean> {
    const state = StorageService.get();

    if (!state[CURRENT_STATE_VERSION].config.dApp.disablePopups) {
      if (await UIService.togglePopupsDialog()) {
        state[CURRENT_STATE_VERSION].config.dApp.disablePopups = true;
        return state[CURRENT_STATE_VERSION].config.dApp.disablePopups;
      }
      throw new Error('User rejected popup toggle');
    } else {
      state[CURRENT_STATE_VERSION].config.dApp.disablePopups = false;
      return state[CURRENT_STATE_VERSION].config.dApp.disablePopups;
    }
  }

  /**
   * Function that changes the DID method
   * @param args.didMethod - DID method to switch to.
   * @returns void
   */
  static async switchDIDMethod(args: SwitchMethodRequestParams): Promise<void> {
    const state = StorageService.get();
    const currentMethod =
      state[CURRENT_STATE_VERSION].accountState[
        state[CURRENT_STATE_VERSION].currentAccount
      ].general.account.ssi.didMethod;
    const newMethod = args.didMethod;

    if (requiresNetwork(newMethod)) {
      await EthereumService.handleNetwork({
        didMethod: newMethod as MethodsRequiringNetwork,
      });
    }

    if (currentMethod !== newMethod) {
      state[CURRENT_STATE_VERSION].accountState[
        state[CURRENT_STATE_VERSION].currentAccount
      ].general.account.ssi.didMethod = newMethod;
      return;
    }
    throw new Error('Method already set');
  }

  /**
   * Function that returns the current DID method
   * @returns string - current DID method
   */
  static async getSelectedMethod(): Promise<string> {
    const state = StorageService.get();
    return state[CURRENT_STATE_VERSION].accountState[
      state[CURRENT_STATE_VERSION].currentAccount
    ].general.account.ssi.didMethod;
  }

  /**
   * Function that returns the current VCStore
   * @returns string - current VCStore
   */
  static async getCredentialStore(): Promise<
    Record<AvailableCredentialStores, boolean>
  > {
    const state = StorageService.get();
    return state[CURRENT_STATE_VERSION].accountState[
      state[CURRENT_STATE_VERSION].currentAccount
    ].general.account.ssi.vcStore;
  }

  /**
   * Function that sets the current VCStore
   * @param args.store - VCStore to set
   * @param args.value - Value to enable/disable the VCStore if applicable
   * @returns boolean - whether the VCStore was set
   */
  static async setCredentialStore(
    args: SetCredentialStoreRequestParams
  ): Promise<boolean> {
    const state = StorageService.get();
    const { store, value } = args;

    if (store !== 'snap') {
      state[CURRENT_STATE_VERSION].accountState[
        state[CURRENT_STATE_VERSION].currentAccount
      ].general.account.ssi.vcStore[store] = value;

      return true;
    }
    return false;
  }

  /**
   * Function that sets the current VCStore
   * @param args.store - VCStore to set
   * @param args.value - Value to enable/disable the VCStore if applicable
   * @returns boolean - whether the VCStore was set
   */
  static async getEnabledCredentialStores(): Promise<
    AvailableCredentialStores[]
  > {
    const state = StorageService.get();

    return Object.entries(
      state[CURRENT_STATE_VERSION].accountState[
        state[CURRENT_STATE_VERSION].currentAccount
      ].general.account.ssi.vcStore
    )
      .filter(([, value]) => value)
      .map(([key]) => key) as AvailableCredentialStores[];
  }

  /**
   * Function that returns a list of enabled VCStores
   * @returns array - list of enabled VCStores
   */
  static async getAvailableCredentialStores(): Promise<string[]> {
    return availableCredentialStores.map((store) => store);
  }

  /**
   * Function that returns the current account settings
   * @returns MascaAccountConfig - current account settings
   */
  static async getAccountSettings(): Promise<MascaAccountConfig> {
    const state = StorageService.get();
    return state[CURRENT_STATE_VERSION].accountState[
      state[CURRENT_STATE_VERSION].currentAccount
    ].general.account;
  }

  /**
   * Function that returns the current snap settings
   * @returns MascaConfig - current snap settings
   */
  static async getSnapSettings(): Promise<MascaConfig> {
    const state = StorageService.get();
    return state[CURRENT_STATE_VERSION].config;
  }

  /**
   * Function that returns a list of available DID methods
   * @returns array - list of available methods
   */
  static async getAvailableMethods(): Promise<string[]> {
    return availableMethods.map((method: string) => method);
  }

  /**
   * Function that sets the Ceramic session token
   * @param args.serializedSession - Ceramic session token
   * @returns void
   */
  static async setCeramicSession(args: {
    serializedSession: string;
  }): Promise<void> {
    const state = StorageService.get();
    state[CURRENT_STATE_VERSION].accountState[
      state[CURRENT_STATE_VERSION].currentAccount
    ].general.ceramicSession = args.serializedSession;
  }

  /**
   * Function that validates and returns the Ceramic session token
   * @returns string - serializied Ceramic session token
   */
  static async validateStoredCeramicSession(): Promise<string> {
    const state = StorageService.get();

    const serializedSession = await validateSession(
      state[CURRENT_STATE_VERSION].accountState[
        state[CURRENT_STATE_VERSION].currentAccount
      ].general.ceramicSession
    );

    return serializedSession;
  }
}

export default GeneralService;
