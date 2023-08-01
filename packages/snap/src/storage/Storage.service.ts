import {
  ImportStateBackupRequestParams,
  isValidMascaState,
  MascaAccountState,
  MascaState,
} from '@blockchain-lab-um/masca-types';

import { getInitialSnapState } from '../utils/config';
import { decryptData, encryptData } from '../utils/snapUtils';
import SnapStorage from './Snap.storage';

class StorageService {
  static instance: MascaState;

  static async init(): Promise<void> {
    const state = await SnapStorage.load();

    if (!state) {
      this.instance = getInitialSnapState();
      return;
    }

    this.instance = state as MascaState;
  }

  static get(): MascaState {
    return this.instance;
  }

  static async save(): Promise<void> {
    await SnapStorage.save(this.instance);
  }

  static getAccountState(): MascaAccountState {
    return this.instance.accountState[this.instance.currentAccount];
  }

  /**
   * Function that exports the current state of the snap.
   * The state is encrypted using the entropy provided by the snap.
   * @returns string - the encrypted backup state.
   */
  static async exportBackup(): Promise<string> {
    return encryptData(JSON.stringify(this.instance));
  }

  /**
   * Function that imports the passed backup state.
   * The state is decrypted using the entropy provided by the snap.
   * @param params - the serialized state to import.
   */
  static async importBackup(
    params: ImportStateBackupRequestParams
  ): Promise<void> {
    try {
      const state = JSON.parse(await decryptData(params.serializedState));
      isValidMascaState(state);
      this.instance = state;
    } catch (error) {
      throw new Error('Invalid backup state.');
    }
  }
}

export default StorageService;
