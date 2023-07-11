import {
  methodIndexMapping,
  type InternalSigMethods,
  type MascaState,
} from '@blockchain-lab-um/masca-types';
import { HDNodeWallet, ethers } from 'ethers';

export const snapGetPrivateKeys = async (params: {
  account: string;
  state: MascaState;
}): Promise<KeysType | null> => {
  const { account, state } = params;
  const method = state.accountState[account].accountConfig.ssi
    .didMethod as InternalSigMethods;
  const regex = /^0x[a-fA-F0-9]{40}$/;
  if (!regex.test(account)) return null;
  
  const entropy = await snap.request({
    method: 'snap_getEntropy',
    params: {
      version: 1,
      salt: account,
    },
  });

  const nodeWallet = HDNodeWallet.fromMnemonic(ethers.Mnemonic.fromEntropy(entropy))
  const child = nodeWallet.derivePath(`m/44/1236/${methodIndexMapping[method]}/0/0`)
  
  return {
    privateKey: child.privateKey,
    publicKey: child.publicKey,
    address: child.address,
    accountIndex: methodIndexMapping[method],
    derivationPath: `m/44/1236/${methodIndexMapping[method]}/0/0`,
  };
};

type KeysType = {
  privateKey: string;
  publicKey: string;
  address: string;
  accountIndex: number;
  addressIndex?: number;
  derivationPath: string;
};
