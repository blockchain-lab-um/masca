import {
  AvailableMethods,
  AvailableVCStores,
  CreateVCRequestParams,
  CreateVPRequestParams,
  DeleteVCsOptions,
  MetaMaskSSISnapRPCRequest,
  QueryVCsRequestParams,
  QueryVCsRequestResult,
  SSIAccountConfig,
  SSISnapApi,
  SSISnapConfig,
  SaveVCOptions,
  SaveVCRequestResult,
} from '@blockchain-lab-um/ssi-snap-types';
import { Result } from '@blockchain-lab-um/utils';
import {
  DIDResolutionResult,
  VerifiableCredential,
  VerifiablePresentation,
  W3CVerifiableCredential,
} from '@veramo/core';

async function sendSnapMethod<T>(
  request: MetaMaskSSISnapRPCRequest,
  snapId: string
): Promise<T> {
  const mmRequest = {
    method: snapId,
    params: request,
  };

  return window.ethereum.request(mmRequest);
}

/**
 * Get a list of VCs stored in Masca under the currently selected MetaMask account
 *
 * @param params - optional parameters for querying VCs
 *
 * @return Result<QueryVCsRequestResult[]> - list of VCs
 */
export async function queryVCs(
  this: MetaMaskSSISnap,
  params?: QueryVCsRequestParams
): Promise<Result<QueryVCsRequestResult[]>> {
  return sendSnapMethod(
    { method: 'queryVCs', params: params || {} },
    this.snapId
  );
}

/**
 * Create a VP from a list of VCs stored in Masca under the currently selected MetaMask account
 *
 * @param params - parameters for creating a VP
 *
 * @return Result<VerifiablePresentation> - VP
 */
export async function createVP(
  this: MetaMaskSSISnap,
  params: CreateVPRequestParams
): Promise<Result<VerifiablePresentation>> {
  return sendSnapMethod(
    {
      method: 'createVP',
      params,
    },
    this.snapId
  );
}

/**
 * Save a VC in Masca under the currently selected MetaMask account
 *
 * @param vc - VC to be saved
 * @param options - optional parameters for saving a VC
 *
 * @return Result<SaveVCRequestResult[]> - list of saved VCs
 */
export async function saveVC(
  this: MetaMaskSSISnap,
  vc: W3CVerifiableCredential,
  options?: SaveVCOptions
): Promise<Result<SaveVCRequestResult[]>> {
  return sendSnapMethod(
    {
      method: 'saveVC',
      params: {
        verifiableCredential: vc,
        options,
      },
    },
    this.snapId
  );
}

/**
 * Delete a VC from Masca under the currently selected MetaMask account
 *
 * @param id - ID of the VC to be deleted
 * @param options - optional parameters for deleting a VC
 *
 * @return Result<boolean[]> - list of results for each VC
 */
export async function deleteVC(
  this: MetaMaskSSISnap,
  id: string,
  options?: DeleteVCsOptions
): Promise<Result<boolean[]>> {
  return sendSnapMethod(
    {
      method: 'deleteVC',
      params: {
        id,
        options,
      },
    },
    this.snapId
  );
}

/**
 * Get the DID of the currently selected MetaMask account
 *
 * @return Result<string> - DID
 */
export async function getDID(this: MetaMaskSSISnap): Promise<Result<string>> {
  return sendSnapMethod({ method: 'getDID' }, this.snapId);
}

/**
 * Get the currently selected DID method
 *
 * @return Result<string> - DID method
 */
export async function getSelectedMethod(
  this: MetaMaskSSISnap
): Promise<Result<string>> {
  return sendSnapMethod({ method: 'getSelectedMethod' }, this.snapId);
}

/**
 * Get a list of available DID methods
 *
 * @return Result<string[]> - list of available DID methods
 */
export async function getAvailableMethods(
  this: MetaMaskSSISnap
): Promise<Result<string[]>> {
  return sendSnapMethod({ method: 'getAvailableMethods' }, this.snapId);
}

/**
 * Switch the currently selected DID method
 *
 * @param method - DID method to be switched to
 *
 * @return Result<boolean> - true if the switch was successful
 */
export async function switchDIDMethod(
  this: MetaMaskSSISnap,
  method: AvailableMethods
): Promise<Result<AvailableMethods>> {
  return sendSnapMethod(
    { method: 'switchDIDMethod', params: { didMethod: method } },
    this.snapId
  );
}

/**
 * Enables/disables confirmation popup windows when retrieving VCs, generating VPs,...
 *
 * @return Result<boolean> - true if the switch was successful
 */
export async function togglePopups(
  this: MetaMaskSSISnap
): Promise<Result<boolean>> {
  return sendSnapMethod({ method: 'togglePopups' }, this.snapId);
}

/**
 * Get the status of available VC stores (i.e. whether they are enabled or not)
 *
 * @return Result<Record<AvailableVCStores, boolean>> - status of available VC stores
 */
export async function getVCStore(
  this: MetaMaskSSISnap
): Promise<Result<Record<AvailableVCStores, boolean>>> {
  return sendSnapMethod({ method: 'getVCStore' }, this.snapId);
}

/**
 * Get a list of available VC stores
 *
 * @return Result<string[]> - list of available VC stores
 */
export async function getAvailableVCStores(
  this: MetaMaskSSISnap
): Promise<Result<string[]>> {
  return sendSnapMethod({ method: 'getAvailableVCStores' }, this.snapId);
}

/**
 * Enables/disables a VC store
 *
 * @param store - VC store to be enabled/disabled
 * @param value - true to enable, false to disable
 *
 * @return Result<boolean> - true if the switch was successful
 */
export async function setVCStore(
  this: MetaMaskSSISnap,
  store: AvailableVCStores,
  value: boolean
): Promise<Result<boolean>> {
  return sendSnapMethod(
    { method: 'setVCStore', params: { store, value } },
    this.snapId
  );
}

/**
 * Get account settings (i.e. DID method, VC stores,...)
 *
 * @return Result<SSIAccountConfig> - account settings
 */
export async function getAccountSettings(
  this: MetaMaskSSISnap
): Promise<Result<SSIAccountConfig>> {
  return sendSnapMethod({ method: 'getAccountSettings' }, this.snapId);
}

/**
 * Get Masca settings
 *
 * @return Result<SSISnapConfig> - Masca settings
 */
export async function getSnapSettings(
  this: MetaMaskSSISnap
): Promise<Result<SSISnapConfig>> {
  return sendSnapMethod({ method: 'getSnapSettings' }, this.snapId);
}

/**
 * Resolve a DID
 *
 * @param did - DID to be resolved
 *
 * @return Result<DIDResolutionResult> - DID resolution result
 */
export async function resolveDID(
  this: MetaMaskSSISnap,
  did: string
): Promise<Result<DIDResolutionResult>> {
  return sendSnapMethod({ method: 'resolveDID', params: { did } }, this.snapId);
}

/**
 * Create a Verifiable Presentation
 */
export async function createVC(
  this: MetaMaskSSISnap,
  params: CreateVCRequestParams
): Promise<Result<VerifiableCredential>> {
  return sendSnapMethod(
    {
      method: 'createVC',
      params,
    },
    this.snapId
  );
}

export class MetaMaskSSISnap {
  protected readonly snapOrigin: string;

  protected readonly snapId: string;

  public readonly supportedMethods: Array<AvailableMethods>;

  public constructor(
    snapOrigin: string,
    supportedMethods: Array<AvailableMethods>
  ) {
    this.snapOrigin = snapOrigin;
    this.snapId = `wallet_snap_${this.snapOrigin}`;
    this.supportedMethods = supportedMethods;
  }

  public getSSISnapApi = (): SSISnapApi => {
    return {
      saveVC: saveVC.bind(this),
      queryVCs: queryVCs.bind(this),
      createVP: createVP.bind(this),
      togglePopups: togglePopups.bind(this),
      getDID: getDID.bind(this),
      getSelectedMethod: getSelectedMethod.bind(this),
      getAvailableMethods: getAvailableMethods.bind(this),
      switchDIDMethod: switchDIDMethod.bind(this),
      getVCStore: getVCStore.bind(this),
      setVCStore: setVCStore.bind(this),
      getAvailableVCStores: getAvailableVCStores.bind(this),
      deleteVC: deleteVC.bind(this),
      getSnapSettings: getSnapSettings.bind(this),
      getAccountSettings: getAccountSettings.bind(this),
      resolveDID: resolveDID.bind(this),
      createVC: createVC.bind(this),
    };
  };
}
