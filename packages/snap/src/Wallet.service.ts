import {
  methodIndexMapping,
  type InternalSigMethods,
} from '@blockchain-lab-um/masca-types';
import { ethers, HDNodeWallet } from 'ethers';

import StorageService from './storage/Storage.service';

class WalletService {
  static instance: HDNodeWallet;

  static async init(): Promise<void> {
    const state = StorageService.get();

    const method = state.accountState[state.currentAccount].accountConfig.ssi
      .didMethod as InternalSigMethods;

    if (!['did:key', 'did:key:jwk_jcs-pub', 'did:jwk'].includes(method)) {
      return;
    }

    const entropy = await snap.request({
      method: 'snap_getEntropy',
      params: {
        version: 1,
        salt: state.currentAccount,
      },
    });

    const nodeWallet = HDNodeWallet.fromMnemonic(
      ethers.Mnemonic.fromEntropy(entropy)
    ).derivePath(`m/44/1236/${methodIndexMapping[method]}/0/0`);

    this.instance = nodeWallet;
  }

  static get(): HDNodeWallet {
    return this.instance;
  }
}

export default WalletService;
