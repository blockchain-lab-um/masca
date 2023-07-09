import type {
  AvailableVCStores,
  MascaState,
} from '@blockchain-lab-um/masca-types';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';
import type { Component } from '@metamask/snaps-ui';

import { updateSnapState } from './stateUtils';

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
 * Function that toggles the disablePopups flag.
 *
 * @param snap - snaps global object.
 * @param state - current state of the snap.
 *
 * @returns void
 */
export async function togglePopups(snap: SnapsGlobalObject, state: MascaState) {
  state.snapConfig.dApp.disablePopups = !state.snapConfig.dApp.disablePopups;
  await updateSnapState(state);
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
 * Function that returns the available VC stores for the passed account.
 *
 * @param account - account to get the available stores for.
 * @param state - masca state object.
 * @param vcstores - optional list of vcstores to check if enabled.
 *
 * @returns - list of available vcstores.
 */
export function getEnabledVCStores(
  account: string,
  state: MascaState,
  vcstores?: AvailableVCStores[]
): string[] {
  const stores =
    vcstores ??
    (Object.keys(
      state.accountState[account].accountConfig.ssi.vcStore
    ) as AvailableVCStores[]);

  return stores.filter(
    (store) => state.accountState[account].accountConfig.ssi.vcStore[store]
  );
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
