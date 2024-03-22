import {
  type AvailableCredentialStores,
  CURRENT_STATE_VERSION,
  type ImportStateBackupRequestParams,
  type MascaAccountConfig,
  type MascaConfig,
  type MascaRPCRequest,
  type MethodsRequiringNetwork,
  type SetCredentialStoreRequestParams,
  type SwitchMethodRequestParams,
  availableCredentialStores,
  availableMethods,
  isValidMascaState,
  requiresNetwork,
} from '@blockchain-lab-um/masca-types';

import EncryptionService from './Encryption.service';
import EthereumService from './Ethereum.service';
import UIService from './UI.service';
import StorageService from './storage/Storage.service';
import { validateSession } from './utils/ceramicUtils';
import { getEmptyAccountState, getInitialPermissions } from './utils/config';
import { isTrustedDapp, permissionExists } from './utils/permissions';

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
  static async setCurrentAccount(params: { account: string }): Promise<void> {
    const { account } = params;
    const state = StorageService.get();
    state[CURRENT_STATE_VERSION].currentAccount = account;
  }

  /**
   * Function that lets you add a trusted dapp
   * @param dapp - dapp to add to the trusted dapps list.
   * @returns void
   */
  static async addTrustedDapp(params: {
    originHostname: string;
  }): Promise<void> {
    const state = StorageService.get();
    if (params.originHostname === '' || !params.originHostname)
      throw new Error('No origin provided.');
    if (
      permissionExists(params.originHostname, state) &&
      isTrustedDapp(params.originHostname, state)
    )
      return;
    if (!(await UIService.addTrustedDappDialog(params.originHostname))) {
      throw new Error('User rejected trusted dapp addition.');
    }

    if (permissionExists(params.originHostname, state)) {
      state[CURRENT_STATE_VERSION].config.dApp.permissions[
        params.originHostname
      ].trusted = true;
      return;
    }

    state[CURRENT_STATE_VERSION].config.dApp.permissions[
      params.originHostname
    ] = {
      ...getInitialPermissions(),
      trusted: true,
    };
  }

  /**
   * Function that lets you remove a trusted dapp
   * @param dapp - dapp to remove from the trusted dapps list.
   * @returns void
   */
  static async removeTrustedDapp(params: {
    originHostname: string;
  }): Promise<void> {
    if (!(await UIService.removeTrustedDappDialog(params.originHostname))) {
      throw new Error('User rejected trusted dapp removal.');
    }

    const state = StorageService.get();
    if (
      permissionExists(params.originHostname, state) &&
      isTrustedDapp(params.originHostname, state)
    ) {
      state[CURRENT_STATE_VERSION].config.dApp.permissions[
        params.originHostname
      ].trusted = false;
    }
  }

  static async changePermission(params: {
    originHostname: string; // hostname
    method: string;
    value: boolean;
  }): Promise<boolean> {
    const state = StorageService.get();

    // If the user rejects the popup, throw an error
    if (
      !(await UIService.changePermissionDialog({
        permission: params.method,
        value: params.value,
      }))
    ) {
      throw new Error('User rejected permission change.');
    }

    // If the user accepts the popup, change the permission

    if (permissionExists(params.originHostname, state)) {
      state[CURRENT_STATE_VERSION].config.dApp.permissions[
        params.originHostname
      ].methods[params.method as MascaRPCRequest['method']] = params.value;
    } else {
      const initialPermissions = getInitialPermissions();
      initialPermissions.methods[params.method as MascaRPCRequest['method']] =
        params.value;

      state[CURRENT_STATE_VERSION].config.dApp.permissions[
        params.originHostname
      ] = initialPermissions;
    }
    return params.value;
  }

  /**
   * Function that adds dapp settings
   * @param originHostname - hostname of the dapp
   * @returns boolean - whether the dapp settings were added
   */
  static async addDappSettings(originHostname: string): Promise<void> {
    const state = StorageService.get();
    if (permissionExists(originHostname, state)) return;

    state[CURRENT_STATE_VERSION].config.dApp.permissions[originHostname] =
      getInitialPermissions();
  }

  static async removeDappSettings(originHostname: string): Promise<void> {
    const state = StorageService.get();
    if (!permissionExists(originHostname, state)) return;

    delete state[CURRENT_STATE_VERSION].config.dApp.permissions[originHostname];
  }

  /**
   * Function that checks if a dApp is trusted
   * @param params.id - dApp to check.
   * @returns boolean - whether the dapp is trusted.
   */
  static async isTrustedDapp(params: { id: string }): Promise<boolean> {
    const { id } = params;
    const state = StorageService.get();
    return isTrustedDapp(id, state);
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
      throw new Error('User rejected popup toggle.');
    }
    state[CURRENT_STATE_VERSION].config.dApp.disablePopups = false;
    return state[CURRENT_STATE_VERSION].config.dApp.disablePopups;
  }

  /**
   * Function that changes the DID method
   * @param params.didMethod - DID method to switch to.
   * @returns void
   */
  static async switchDIDMethod(
    params: SwitchMethodRequestParams
  ): Promise<void> {
    const state = StorageService.get();
    const currentMethod =
      state[CURRENT_STATE_VERSION].accountState[
        state[CURRENT_STATE_VERSION].currentAccount
      ].general.account.ssi.selectedMethod;
    const newMethod = params.didMethod;

    if (requiresNetwork(newMethod)) {
      await EthereumService.handleNetwork({
        didMethod: newMethod as MethodsRequiringNetwork,
      });
    }

    if (currentMethod !== newMethod) {
      state[CURRENT_STATE_VERSION].accountState[
        state[CURRENT_STATE_VERSION].currentAccount
      ].general.account.ssi.selectedMethod = newMethod;
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
    ].general.account.ssi.selectedMethod;
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
    ].general.account.ssi.storesEnabled;
  }

  /**
   * Function that sets the current VCStore
   * @param params.store - VCStore to set
   * @param params.value - Value to enable/disable the VCStore if applicable
   * @returns boolean - whether the VCStore was set
   */
  static async setCredentialStore(
    params: SetCredentialStoreRequestParams
  ): Promise<boolean> {
    const state = StorageService.get();
    const { store, value } = params;

    if (store !== 'snap') {
      state[CURRENT_STATE_VERSION].accountState[
        state[CURRENT_STATE_VERSION].currentAccount
      ].general.account.ssi.storesEnabled[store] = value;

      return true;
    }
    return false;
  }

  /**
   * Function that returns a list of enabled Credential Stores
   * @returns array - list of enabled Credential Stores
   */
  static async getEnabledCredentialStores(): Promise<
    AvailableCredentialStores[]
  > {
    const state = StorageService.get();

    return Object.entries(
      state[CURRENT_STATE_VERSION].accountState[
        state[CURRENT_STATE_VERSION].currentAccount
      ].general.account.ssi.storesEnabled
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
   * @param params.serializedSession - Ceramic session token
   * @returns void
   */
  static async setCeramicSession(params: {
    serializedSession: string;
  }): Promise<void> {
    const state = StorageService.get();
    state[CURRENT_STATE_VERSION].accountState[
      state[CURRENT_STATE_VERSION].currentAccount
    ].general.ceramicSession = params.serializedSession;
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

  /**
   * Function that exports the current state of the snap.
   * The state is encrypted using the entropy provided by the snap.
   * @returns string - the encrypted backup state.
   */
  static async exportBackup(): Promise<string> {
    if (!(await UIService.exportBackupDialog())) {
      throw new Error('User rejected export backup.');
    }

    const state = StorageService.get();
    return EncryptionService.encrypt(JSON.stringify(state));
  }

  /**
   * Function that imports the passed backup state.
   * The state is decrypted using the entropy provided by the snap.
   * @param params - the serialized state to import.
   */
  static async importBackup(
    params: ImportStateBackupRequestParams
  ): Promise<void> {
    if (!(await UIService.importBackupDialog())) {
      throw new Error('User rejected export backup.');
    }

    try {
      const state = JSON.parse(
        await EncryptionService.decrypt(params.serializedState)
      );

      const latestState = StorageService.migrateState(state);

      isValidMascaState(latestState);
      StorageService.set(latestState);
    } catch (error) {
      console.error(error);
      throw new Error('Invalid backup state.');
    }
  }
}

export default GeneralService;
