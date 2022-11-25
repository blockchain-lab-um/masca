import { VerifiableCredential, VerifiablePresentation } from '@veramo/core';
import {
  MetaMaskSSISnapRPCRequest,
  VCQuery,
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
 * @param {VCQuery} query - Query for filtering through all VCs
 * @return {Promise<Array<VerifiableCredential>>} list of VCs
 */
export async function queryVCs(
  this: MetaMaskSSISnap,
  query?: VCQuery
): Promise<VerifiableCredential[]> {
  if (!query) query = {};
  return await sendSnapMethod(
    { method: 'queryVCs', params: { query: query } },
    this.snapId
  );
}

/**
 * Get a VP from a VC
 *
 * @param {string} vc_id - ID of VC used for generating a VP. Can be obtained with queryVCs function
 * optional @param {string} challenge
 * optional @param {string} domain
 */
export async function createVP(
  this: MetaMaskSSISnap,
  vcId: string,
  challenge?: string,
  domain?: string
): Promise<VerifiablePresentation> {
  return await sendSnapMethod(
    {
      method: 'createVP',
      params: { vcId: vcId, challenge: challenge, domain: domain },
    },
    this.snapId
  );
}

/**
 * Save a VC in the SSI Snap under currently selected MetaMask account
 *
 * @param {VerifiableCredential} verifiableCredential - vc
 *
 */
export async function saveVC(
  this: MetaMaskSSISnap,
  verifiableCredential: VerifiableCredential
): Promise<boolean> {
  return await sendSnapMethod(
    {
      method: 'saveVC',
      params: { verifiableCredential: verifiableCredential },
    },
    this.snapId
  );
}

export async function getDID(this: MetaMaskSSISnap): Promise<string> {
  return await sendSnapMethod({ method: 'getDID' }, this.snapId);
}

export async function getMethod(this: MetaMaskSSISnap): Promise<string> {
  return await sendSnapMethod({ method: 'getMethod' }, this.snapId);
}

export async function getAvailableMethods(
  this: MetaMaskSSISnap
): Promise<string[]> {
  return await sendSnapMethod({ method: 'getAvailableMethods' }, this.snapId);
}

export async function switchMethod(
  this: MetaMaskSSISnap,
  didMethod: string
): Promise<boolean> {
  return await sendSnapMethod(
    { method: 'switchMethod', params: { didMethod: didMethod } },
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
    { method: 'changeInfuraToken', params: { infuraToken: infuraToken } },
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
  vcStore: string
): Promise<boolean> {
  return await sendSnapMethod(
    { method: 'setVCStore', params: { vcStore: vcStore } },
    this.snapId
  );
}
