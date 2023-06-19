import { MascaState } from '@blockchain-lab-um/masca-types';
import { BIP44CoinTypeNode } from '@metamask/key-tree';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';

export type SnapConfirmParams = {
  prompt: string;
  description?: string;
  textAreaContent?: string;
};

export interface ApiParams {
  state: MascaState;
  snap: SnapsGlobalObject;
  ethereum: MetaMaskInpageProvider;
  account: string;
  bip44CoinTypeNode?: BIP44CoinTypeNode;
  origin: string;
  ebsiBearer?: string;
}
