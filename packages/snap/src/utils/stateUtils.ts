import type { MascaState } from '@blockchain-lab-um/masca-types';
import type { Json } from '@metamask/snaps-types';

/**
 * Helper function to update MascaState object in the Snaps global object
 *
 * @param snap - Snaps global object
 * @param snapState - MascaState object
 *
 * @returns void
 */
export async function updateSnapState(snapState: MascaState) {
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
export async function getSnapState(): Promise<MascaState> {
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
export async function getSnapStateUnchecked(): Promise<MascaState | null> {
  const state = (await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  })) as MascaState | null;
  return state;
}
