import type {
  AvailableVCStores,
  MascaState,
} from '@blockchain-lab-um/masca-types';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { Component } from '@metamask/snaps-ui';

/**
 * Function that returns address of the currently selected MetaMask account.
 *
 * @param state - MascaState object.
 *
 * @returns string - address of the currently selected MetaMask account.
 * */
export function getCurrentAccount(state: MascaState): string {
  if (state.currentAccount === '') {
    throw new Error('No account set. Use setCurrentAccount to set an account.');
  }
  return state.currentAccount;
}

/**
 * Function that returns the current network.
 *
 * @param ethereum - MetaMaskInpageProvider object.
 *
 * @returns string - current network.
 */
export async function getCurrentNetwork(
  ethereum: MetaMaskInpageProvider
): Promise<string> {
  const network = (await ethereum.request({
    method: 'eth_chainId',
  })) as string;

  return network;
}

/**
 * Function that returns whether the user has confirmed the snap dialog.
 *
 * @param content - content to display in the snap dialog.
 *
 * @returns boolean - whether the user has confirmed the snap dialog.
 */
export async function snapConfirm(content: Component): Promise<boolean> {
  const res = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content,
    },
  });
  return res as boolean;
}

/**
 * Checks if the passed VC store is enabled for the passed account.
 *
 * @param account - account to check.
 * @param state - masca state object.
 * @param store - vc store to check.
 *
 * @returns boolean - whether the vc store is enabled.
 */
export function isEnabledVCStore(
  account: string,
  state: MascaState,
  store: AvailableVCStores
): boolean {
  return state.accountState[account].accountConfig.ssi.vcStore[store];
}
