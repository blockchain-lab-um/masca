import { MascaAccountState, MascaState } from '@blockchain-lab-um/masca-types';

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

  static async getAccountState(): Promise<MascaAccountState> {
    return this.instance.accountState[this.instance.currentAccount];
  }
}

export default StorageService;
