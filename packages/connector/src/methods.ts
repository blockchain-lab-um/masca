import { VerifiablePresentation, W3CVerifiableCredential } from '@veramo/core';
import {
  AvailableMethods,
  AvailableVCStores,
  CreateVPRequestParams,
  MetaMaskSSISnapRPCRequest,
  QueryVCsRequestParams,
  QueryVCsRequestResult,
  SaveVCOptions,
  SaveVCRequestResult,
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
  vc: W3CVerifiableCredential,
  options?: SaveVCOptions
): Promise<SaveVCRequestResult[]> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return await sendSnapMethod(
    {
      method: 'saveVC',
      params: {
        verifiableCredential: vc,
        options: options,
      },
    },
    this.snapId
  );
}

export async function getDID(this: MetaMaskSSISnap): Promise<string> {
  return await sendSnapMethod({ method: 'getDID' }, this.snapId);
}

export async function getSelectedMethod(
  this: MetaMaskSSISnap
): Promise<AvailableMethods> {
  return await sendSnapMethod({ method: 'getSelectedMethod' }, this.snapId);
}

export async function getAvailableMethods(
  this: MetaMaskSSISnap
): Promise<AvailableMethods> {
  return await sendSnapMethod({ method: 'getAvailableMethods' }, this.snapId);
}

export async function switchDIDMethod(
  this: MetaMaskSSISnap,
  method: AvailableMethods
): Promise<boolean> {
  return await sendSnapMethod(
    { method: 'switchDIDMethod', params: { didMethod: method } },
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
  infuraToken: string
): Promise<boolean> {
  return await sendSnapMethod(
    { method: 'changeInfuraToken', params: { infuraToken } },
    this.snapId
  );
}

export async function getVCStore(
  this: MetaMaskSSISnap
): Promise<Record<AvailableVCStores, boolean>> {
  return await sendSnapMethod({ method: 'getVCStore' }, this.snapId);
}

export async function getAvailableVCStores(
  this: MetaMaskSSISnap
): Promise<string[]> {
  return await sendSnapMethod({ method: 'getAvailableVCStores' }, this.snapId);
}

export async function setVCStore(
  this: MetaMaskSSISnap,
  store: AvailableVCStores,
  value: boolean
): Promise<boolean> {
  return await sendSnapMethod(
    { method: 'setVCStore', params: { store, value } },
    this.snapId
  );
}
