import { getSnapState, updateSnapState } from './utils/stateUtils';

class GeneralService {
  // static async init(): Promise<void> {}
  static async setCurrentAccount(account: string): Promise<void> {
    const state = await getSnapState();
    state.currentAccount = account;
    await updateSnapState(state);
  }
}

export default GeneralService;
