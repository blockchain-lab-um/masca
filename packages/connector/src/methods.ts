import { VerifiablePresentation } from '@veramo/core';
import {
  AvailableMethods,
  ChangeInfuraTokenRequestParams,
  CreateVPRequestParams,
  MetaMaskSSISnapRPCRequest,
  QueryVCsRequestParams,
  QueryVCsRequestResult,
  SaveVCRequestParams,
  SetVCStoreRequestParams,
  SwitchMethodRequestParams,
} from '@blockchain-lab-um/ssi-snap-types';
import { MetaMaskSSISnap } from './snap';

async function sendSnapMethod<T>(
  request: MetaMaskSSISnapRPCRequest,
  snapId: string
): Promise<T> {
  const mmRequest = {
    method: snapId,
    params: request,
  };
  console.log(mmRequest);
  return await window.ethereum.request(mmRequest);
}

/**
 * Get a list of VCs stored in the SSI Snap under currently selected MetaMask account
 */
export async function queryVCs(
  this: MetaMaskSSISnap,
  params?: QueryVCsRequestParams
): Promise<QueryVCsRequestResult[]> {
  return await sendSnapMethod(
    { method: 'queryVCs', params: params || {} },
    this.snapId
  );
}

/**
 * Create a VP from a VC
 */
export async function createVP(
  this: MetaMaskSSISnap,
  params: CreateVPRequestParams
): Promise<VerifiablePresentation> {
  return await sendSnapMethod(
    {
      method: 'createVP',
      params: params,
    },
    this.snapId
  );
}

/**
 * Save a VC in the SSI Snap under currently selected MetaMask account
 */
export async function saveVC(
  this: MetaMaskSSISnap,
  params: SaveVCRequestParams
): Promise<boolean> {
  return await sendSnapMethod(
    {
      method: 'saveVC',
      params: params,
    },
    this.snapId
  );
}

export async function getDID(this: MetaMaskSSISnap): Promise<string> {
  return await sendSnapMethod({ method: 'getDID' }, this.snapId);
}

export async function getMethod(
  this: MetaMaskSSISnap
): Promise<AvailableMethods> {
  return await sendSnapMethod({ method: 'getSelectedMethod' }, this.snapId);
}

export async function getAvailableMethods(
  this: MetaMaskSSISnap
): Promise<AvailableMethods> {
  return await sendSnapMethod({ method: 'getAvailableMethods' }, this.snapId);
}

export async function switchMethod(
  this: MetaMaskSSISnap,
  params: SwitchMethodRequestParams
): Promise<boolean> {
  return await sendSnapMethod(
    { method: 'switchDIDMethod', params: params },
    this.snapId
  );
}

/**
 * Toggle popups - enable/disable "Are you sure?" confirmation windows when retrieving VCs and generating VPs,...
 *
 */
export async function togglePopups(this: MetaMaskSSISnap): Promise<boolean> {
  return await sendSnapMethod({ method: 'togglePopups' }, this.snapId);
}

/**
 * Change infura token
 *
 * @param {string} infuraToken
 *
 */
export async function changeInfuraToken(
  this: MetaMaskSSISnap,
  params: ChangeInfuraTokenRequestParams
): Promise<boolean> {
  return await sendSnapMethod(
    { method: 'changeInfuraToken', params: params },
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
    { method: 'setVCStore', params: params },
    this.snapId
  );
}
