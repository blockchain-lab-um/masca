import { SnapsGlobalObject } from '@metamask/snaps-types';

import { ApiParams, SSISnapState } from '../interfaces';
import { getEmptyAccountState, getInitialSnapState } from './config';

/**
 * Helper function to update SSISnapState object in the Snaps global object
 *
 * @param snap - Snaps global object
 * @param snapState - SSISnapState object
 *
 * @returns void
 */
export async function updateSnapState(
  snap: SnapsGlobalObject,
  snapState: SSISnapState
) {
  await snap.request({
    method: 'snap_manageState',
    params: { operation: 'update', newState: snapState },
  });
}

/**
 * Helper function to retrieve SSISnapState object from the Snaps global object
 *
 * @param snap - Snaps global object
 *
 * @returns SSISnapState - SSISnapState object
 */
export async function getSnapState(
  snap: SnapsGlobalObject
): Promise<SSISnapState> {
  const state = (await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  })) as SSISnapState | null;

  if (!state) throw Error('SSISnapState is not initialized!');
  return state;
}

/**
 * Helper function to retrieve SSISnapState object from the Snaps global object
 * without throwing an error if it is not initialized
 *
 * @param snap - Snaps global object
 *
 * @returns SSISnapState | null - SSISnapState object or null
 */
export async function getSnapStateUnchecked(
  snap: SnapsGlobalObject
): Promise<SSISnapState | null> {
  const state = (await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  })) as SSISnapState | null;
  return state;
}

/**
 * Function that initializes the SSISnapState object in the Snaps global object.
 *
 * @param snap - Snaps global object
 *
 * @returns SSISnapState - the updated SSISnapState object
 */
export async function initSnapState(
  snap: SnapsGlobalObject
  // ethereum: MetaMaskInpageProvider
): Promise<SSISnapState> {
  const state = getInitialSnapState();
  // state.currentAddress = ethereum.currentAddress || '';
  await updateSnapState(snap, state);
  return state;
}

/**
 * Function that creates an empty SSIAccountState object in the SSI Snap state for the provided address.
 *
 * @param params - ApiParams object
 *
 * @returns void
 */
export async function initAccountState(params: ApiParams): Promise<void> {
  const { state, snap, account } = params;
  state.accountState[account] = getEmptyAccountState();
  await updateSnapState(snap, state);
}
