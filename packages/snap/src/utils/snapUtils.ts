import {
  CURRENT_STATE_VERSION,
  type AvailableCredentialStores,
  type MascaState,
} from '@blockchain-lab-um/masca-types';

/**
 * Checks if the passed VC store is enabled for the passed account.
 * @param account - account to check.
 * @param state - masca state object.
 * @param store - vc store to check.
 * @returns boolean - whether the vc store is enabled.
 */
export function isEnabledCredentialStore(
  account: string,
  state: MascaState,
  store: AvailableCredentialStores
): boolean {
  return state[CURRENT_STATE_VERSION].accountState[account].general.account.ssi
    .vcStore[store];
}
