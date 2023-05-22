import { MascaState } from '@blockchain-lab-um/masca-types';
import { SnapsGlobalObject } from '@metamask/snaps-types';

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
