import {
  methodIndexMapping,
  type InternalSigMethods,
  CURRENT_STATE_VERSION,
} from '@blockchain-lab-um/masca-types';
import { HDNodeWallet, Mnemonic } from 'ethers';

import StorageService from './storage/Storage.service';

class WalletService {
  static instance: HDNodeWallet;

  /**
   * Function that initializes the wallet service.
   * @returns void
   */
  static async init(): Promise<void> {
    const state = StorageService.get();

    const method = state[CURRENT_STATE_VERSION].accountState[state[CURRENT_STATE_VERSION].currentAccount].general.account.ssi
      .selectedMethod as InternalSigMethods;

    if (!['did:key', 'did:key:jwk_jcs-pub', 'did:jwk'].includes(method)) {
      return;
    }

    const entropy = await snap.request({
      method: 'snap_getEntropy',
      params: {
        version: 1,
        salt: state[CURRENT_STATE_VERSION].currentAccount,
      },
    });

    const nodeWallet = HDNodeWallet.fromMnemonic(
      Mnemonic.fromEntropy(entropy)
    ).derivePath(`m/44/1236/${methodIndexMapping[method]}/0/0`);

    this.instance = nodeWallet;
  }

  static get(): HDNodeWallet {
    return this.instance;
  }
}

export default WalletService;
