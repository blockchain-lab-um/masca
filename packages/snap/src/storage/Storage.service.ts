import {
  CURRENT_STATE_VERSION,
  MascaAccountState,
  MascaState,
} from '@blockchain-lab-um/masca-types';

import { getInitialSnapState } from '../utils/config';
import SnapStorage from './Snap.storage';

const STATE_VERSION = 'v1';
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
    return this.instance[CURRENT_STATE_VERSION].accountState[
      this.instance[CURRENT_STATE_VERSION].currentAccount
    ];
  }
}

export default StorageService;
