import { ApiParams, SSISnapState } from '../interfaces';
import { getPublicKey } from './snapUtils';
import { getEmptyAccountState, getInitialSnapState } from './config';
import { SnapProvider } from '@metamask/snap-types';

/**
 * Function for updating SSISnapState object in the MetaMask state
 *
 * @public
 *
 * @param {SSISnapState} snapState - object to replace the current object in the MetaMask state.
 *
 * @beta
 *
 **/
export async function updateSnapState(
  wallet: SnapProvider,
  snapState: SSISnapState
) {
  await wallet.request({
    method: 'snap_manageState',
    params: ['update', snapState],
  });
}

/**
 * Function to retrieve SSISnapState object from the MetaMask state
 *
 * @public
 *
 * @returns {Promise<SSISnapState>} object from the state
 *
 * @beta
 *
 **/
export async function getSnapState(
  wallet: SnapProvider
): Promise<SSISnapState> {
  const state = (await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  })) as SSISnapState | null;

  if (!state) throw Error('SSISnapState is not initialized!');
  return state;
}

/**
 * Function to retrieve SSISnapState object from the MetaMask state
 *
 * @public
 *
 * @returns {Promise<SSISnapState>} object from the state
 *
 * @beta
 *
 **/
export async function getSnapStateUnchecked(
  wallet: SnapProvider
): Promise<SSISnapState | null> {
  return (await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  })) as SSISnapState | null;
}

/**
 * Function to initialize SSISnapState object
 *
 * @public
 *
 * @returns {Promise<SSISnapState>} object
 *
 * @beta
 *
 **/
export async function initSnapState(
  wallet: SnapProvider
): Promise<SSISnapState> {
  const state = getInitialSnapState();
  await updateSnapState(wallet, state);
  return state;
}

/**
 * Function that creates an empty SSIAccountState object in the SSI Snap state for the provided address.
 *
 * @public
 *
 * @param {SSISnapState} state - SSISnapState
 * @param {string} account - MetaMask account
 *
 * @beta
 *
 **/
export async function initAccountState(params: ApiParams): Promise<void> {
  const { state, wallet, account } = params;
  state.accountState[account] = getEmptyAccountState();
  // FIXME: How to handle if user declines signature ?
  const publicKey = await getPublicKey(params);
  state.accountState[account].publicKey = publicKey;
  await updateSnapState(wallet, state);
}
