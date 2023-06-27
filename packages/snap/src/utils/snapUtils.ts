import type {
  AvailableVCStores,
  MascaState,
} from '@blockchain-lab-um/masca-types';
import { BIP44CoinTypeNode } from '@metamask/key-tree';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';
import type { Component } from '@metamask/snaps-ui';

import { snapGetKeysFromAddress } from './keyPair';
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
  await updateSnapState(snap, state);
}

/**
 * Function that lets you add a friendly dApp
 *
 * @param snap - snaps global object.
 * @param state - current state of the snap.
 * @param dapp - dApp to add to the friendly dApps list.
 *
 * @returns void
 */
export async function addFriendlyDapp(
  snap: SnapsGlobalObject,
  state: MascaState,
  dapp: string
) {
  if (state.snapConfig.dApp.friendlyDapps.includes(dapp)) return;
  state.snapConfig.dApp.friendlyDapps.push(dapp);
  await updateSnapState(snap, state);
}

/**
 * Function that lets you remove a friendly dApp
 *
 * @param snap - snaps global object.
 * @param state - current state of the snap.
 * @param dapp - dApp to remove from the friendly dApps list.
 *
 * @returns void
 */
export async function removeFriendlyDapp(
  snap: SnapsGlobalObject,
  state: MascaState,
  dapp: string
) {
  state.snapConfig.dApp.friendlyDapps =
    state.snapConfig.dApp.friendlyDapps.filter((d) => d !== dapp);
  await updateSnapState(snap, state);
}

/**
 * Function that return the public key for the current account.
 *
 * @param params - ApiParams object.
 *
 * @returns string - public key for the current account.
 */
export async function getPublicKey(params: {
  snap: SnapsGlobalObject;
  state: MascaState;
  account: string;
  bip44CoinTypeNode: BIP44CoinTypeNode;
}): Promise<string> {
  const { snap, state, account, bip44CoinTypeNode } = params;

  if (state.accountState[account].publicKey !== '') {
    return state.accountState[account].publicKey;
  }

  const res = await snapGetKeysFromAddress({
    snap,
    bip44CoinTypeNode,
    account,
    state,
  });

  if (res === null) throw new Error('Could not get keys from address');
  return res.publicKey;
}

/**
 * Function that returns whether the user has confirmed the snap dialog.
 *
 * @param snap - snaps global object.
 * @param content - content to display in the snap dialog.
 *
 * @returns boolean - whether the user has confirmed the snap dialog.
 */
export async function snapConfirm(
  snap: SnapsGlobalObject,
  content: Component
): Promise<boolean> {
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

/**
 * Sets the passed public key to the passed account.
 *
 * @param state - masca state object.
 * @param snap - snaps global object.
 * @param ethereum - metamask inpage provider.
 * @param account - account to set the public key for.
 * @param bip44CoinTypeNode - optional bip44 coin type node.
 * @param origin - origin of the request.
 *
 * @returns void
 */
// export async function setAccountPublicKey(params: ApiParams): Promise<void> {
//   const { state, snap, account, bip44CoinTypeNode } = params;
//   const publicKey = await getPublicKey({
//     snap,
//     state,
//     account,
//     bip44CoinTypeNode: bip44CoinTypeNode as BIP44CoinTypeNode,
//   });
//   state.accountState[account].publicKey = publicKey;
//   await updateSnapState(snap, state);
// }
