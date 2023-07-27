import {
  ImportStateBackupRequestParams,
  isValidMascaState,
  MascaAccountState,
  MascaState,
} from '@blockchain-lab-um/masca-types';

import { getInitialSnapState } from '../utils/config';
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

  static exportBackup(): string {
    return JSON.stringify(this.instance);
  }

  static importBackup(params: ImportStateBackupRequestParams): void {
    try {
      const state = JSON.parse(params.serializedState);
      isValidMascaState(state);
      this.instance = state;
    } catch (error) {
      throw new Error('Invalid backup state.');
    }
  }
}

export default StorageService;
