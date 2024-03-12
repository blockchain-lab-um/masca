import {
  CURRENT_STATE_VERSION,
  type InternalSigMethods,
  methodIndexMapping,
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

    const method = state[CURRENT_STATE_VERSION].accountState[
      state[CURRENT_STATE_VERSION].currentAccount
    ].general.account.ssi.selectedMethod as InternalSigMethods;

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
    ).derivePath(`44/1236/${methodIndexMapping[method]}/0/0`);

    WalletService.instance = nodeWallet;
  }

  static get(): HDNodeWallet {
    return WalletService.instance;
  }

  /**
   * Function that creates a wallet from MM entropy and returns a wallet id for current metamask.
   * @returns string - Wallet id
   */
  static async getWalletId(): Promise<string> {
    const entropy = await snap.request({
      method: 'snap_getEntropy',
      params: {
        version: 1,
      },
    });

    const nodeWallet = HDNodeWallet.fromMnemonic(Mnemonic.fromEntropy(entropy));

    return nodeWallet.address;
  }
}

export default WalletService;
