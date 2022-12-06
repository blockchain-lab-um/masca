import { VerifiableCredential, VerifiablePresentation } from '@veramo/core';
import {
  ChangeInfuraTokenRequestParams,
  CreateVPRequestParams,
  MetaMaskSSISnapRPCRequest,
  QueryRequestParams,
  SaveVCRequestParams,
  SetVCStoreRequestParams,
  SwitchMethodRequestParams,
} from '@blockchain-lab-um/ssi-snap-types';
import { MetaMaskSSISnap } from './snap';

async function sendSnapMethod<T>(
  request: MetaMaskSSISnapRPCRequest,
  snapId: string
): Promise<T> {
  console.log('Request:', request);
  return await window.ethereum.request({
    method: snapId,
    params: [request],
  });
}

/**
 * Get a list of VCs stored in the SSI Snap under currently selected MetaMask account
 *
 * @param {QueryRequestParams} params - Query for filtering through all VCs
 * @return {Promise<Array<VerifiableCredential>>} list of VCs
 */
export async function queryVCs(
  this: MetaMaskSSISnap,
  params: QueryRequestParams
): Promise<VerifiableCredential[]> {
  return await sendSnapMethod(
    {
      method: 'query',
      params,
    },
    this.snapId
  );
}

/**
 * Get a VP from a VC
 *
 * @param {CreateVPRequestParams} params - VP creation params object
 */
export async function createVP(
  this: MetaMaskSSISnap,
  params: CreateVPRequestParams
): Promise<VerifiablePresentation> {
  return await sendSnapMethod(
    {
      method: 'createVP',
      params,
    },
    this.snapId
  );
}

/**
 * Save a VC in the SSI Snap under currently selected MetaMask account
 *
 * @param {SaveVCRequestParams} params - VC saving params object
 */
export async function saveVC(
  this: MetaMaskSSISnap,
  params: SaveVCRequestParams
): Promise<boolean> {
  return await sendSnapMethod(
    {
      method: 'saveVC',
      params,
    },
    this.snapId
  );
}

export async function getDID(this: MetaMaskSSISnap): Promise<string> {
  return await sendSnapMethod({ method: 'getDID' }, this.snapId);
}

export async function getMethod(this: MetaMaskSSISnap): Promise<string> {
  return await sendSnapMethod({ method: 'getSelectedMethod' }, this.snapId);
}

export async function getAvailableMethods(
  this: MetaMaskSSISnap
): Promise<string[]> {
  return await sendSnapMethod({ method: 'getAvailableMethods' }, this.snapId);
}

export async function switchMethod(
  this: MetaMaskSSISnap,
  params: SwitchMethodRequestParams
): Promise<boolean> {
  return await sendSnapMethod(
    {
      method: 'switchDIDMethod',
      params,
    },
    this.snapId
  );
}

/**
 * Toggle popups - enable/disable "Are you sure?" confirmation windows when retrieving VCs and generating VPs,...
 */
export async function togglePopups(this: MetaMaskSSISnap): Promise<boolean> {
  return await sendSnapMethod({ method: 'togglePopups' }, this.snapId);
}

/**
 * Change infura token
 *
 * @param {ChangeInfuraTokenRequestParams} params - Infura token change params object
 *
 */
export async function changeInfuraToken(
  this: MetaMaskSSISnap,
  params: ChangeInfuraTokenRequestParams
): Promise<boolean> {
  return await sendSnapMethod(
    {
      method: 'changeInfuraToken',
      params,
    },
    this.snapId
  );
}

export async function getVCStore(this: MetaMaskSSISnap): Promise<string> {
  return await sendSnapMethod({ method: 'getVCStore' }, this.snapId);
}

export async function getAvailableVCStores(
  this: MetaMaskSSISnap
): Promise<string[]> {
  return await sendSnapMethod({ method: 'getAvailableVCStores' }, this.snapId);
}

export async function setVCStore(
  this: MetaMaskSSISnap,
  params: SetVCStoreRequestParams
): Promise<boolean> {
  return await sendSnapMethod(
    {
      method: 'setVCStore',
      params,
    },
    this.snapId
  );
}
