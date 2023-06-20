import type { MascaState } from '@blockchain-lab-um/masca-types';
import type { Json, SnapsGlobalObject } from '@metamask/snaps-types';

import type { ApiParams } from '../interfaces';
import { getEmptyAccountState, getInitialSnapState } from './config';

/**
 * Helper function to update MascaState object in the Snaps global object
 *
 * @param snap - Snaps global object
 * @param snapState - MascaState object
 *
 * @returns void
 */
export async function updateSnapState(
  snap: SnapsGlobalObject,
  snapState: MascaState
) {
  await snap.request({
    method: 'snap_manageState',
    params: {
      operation: 'update',
      newState: snapState as unknown as Record<string, Json>,
    },
  });
}

/**
 * Helper function to retrieve MascaState object from the Snaps global object
 *
 * @param snap - Snaps global object
 *
 * @returns MascaState - MascaState object
 */
export async function getSnapState(
  snap: SnapsGlobalObject
): Promise<MascaState> {
  const state = (await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  })) as MascaState | null;

  if (!state) throw Error('MascaState is not initialized!');
  return state;
}

/**
 * Helper function to retrieve MascaState object from the Snaps global object
 * without throwing an error if it is not initialized
 *
 * @param snap - Snaps global object
 *
 * @returns MascaState | null - MascaState object or null
 */
export async function getSnapStateUnchecked(
  snap: SnapsGlobalObject
): Promise<MascaState | null> {
  const state = (await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  })) as MascaState | null;
  return state;
}

/**
 * Function that initializes the MascaState object in the Snaps global object.
 *
 * @param snap - Snaps global object
 *
 * @returns MascaState - the updated MascaState object
 */
export async function initSnapState(
  snap: SnapsGlobalObject
): Promise<MascaState> {
  const state = getInitialSnapState();
  await updateSnapState(snap, state);
  return state;
}

/**
 * Function that creates an empty MascaAccountState object in the Masca state for the provided address.
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
