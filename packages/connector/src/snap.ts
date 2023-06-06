import type {
  AvailableMethods,
  AvailableVCStores,
  CreateVCRequestParams,
  CreateVPRequestParams,
  DeleteVCsOptions,
  HandleOIDCAuthorizationRequestParams,
  HandleOIDCCredentialOfferRequestParams,
  MascaAccountConfig,
  MascaApi,
  MascaConfig,
  MascaRPCRequest,
  QueryVCsRequestParams,
  QueryVCsRequestResult,
  SaveVCOptions,
  SaveVCRequestResult,
  SendOIDCAuthorizationResponseParams,
  SetCurrentAccountRequestParams,
} from '@blockchain-lab-um/masca-types';
import type { Result } from '@blockchain-lab-um/utils';
import type {
  DIDResolutionResult,
  VerifiableCredential,
  VerifiablePresentation,
  W3CVerifiableCredential,
} from '@veramo/core';

async function sendSnapMethod<T>(
  request: MascaRPCRequest,
  snapId: string
): Promise<T> {
  return window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId,
      request,
    },
  });
}

/**
 * Get a list of VCs stored in Masca under the currently selected MetaMask account
 *
 * @param params - optional parameters for querying VCs
 *
 * @return Result<QueryVCsRequestResult[]> - list of VCs
 */
export async function queryVCs(
  this: Masca,
  params?: QueryVCsRequestParams
): Promise<Result<QueryVCsRequestResult[]>> {
  return sendSnapMethod(
    { method: 'queryVCs', params: params ?? {} },
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
  this: Masca,
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
  this: Masca,
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
  this: Masca,
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
export async function getDID(this: Masca): Promise<Result<string>> {
  return sendSnapMethod({ method: 'getDID' }, this.snapId);
}

/**
 * Get the currently selected DID method
 *
 * @return Result<string> - DID method
 */
export async function getSelectedMethod(this: Masca): Promise<Result<string>> {
  return sendSnapMethod({ method: 'getSelectedMethod' }, this.snapId);
}

/**
 * Get a list of available DID methods
 *
 * @return Result<string[]> - list of available DID methods
 */
export async function getAvailableMethods(
  this: Masca
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
  this: Masca,
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
export async function togglePopups(this: Masca): Promise<Result<boolean>> {
  return sendSnapMethod({ method: 'togglePopups' }, this.snapId);
}

/**
 * Get the status of available VC stores (i.e. whether they are enabled or not)
 *
 * @return Result<Record<AvailableVCStores, boolean>> - status of available VC stores
 */
export async function getVCStore(
  this: Masca
): Promise<Result<Record<AvailableVCStores, boolean>>> {
  return sendSnapMethod({ method: 'getVCStore' }, this.snapId);
}

/**
 * Get a list of available VC stores
 *
 * @return Result<string[]> - list of available VC stores
 */
export async function getAvailableVCStores(
  this: Masca
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
  this: Masca,
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
 * @return Result<MascaAccountConfig> - account settings
 */
export async function getAccountSettings(
  this: Masca
): Promise<Result<MascaAccountConfig>> {
  return sendSnapMethod({ method: 'getAccountSettings' }, this.snapId);
}

/**
 * Get Masca settings
 *
 * @return Result<MascaConfig> - Masca settings
 */
export async function getSnapSettings(
  this: Masca
): Promise<Result<MascaConfig>> {
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
  this: Masca,
  did: string
): Promise<Result<DIDResolutionResult>> {
  return sendSnapMethod({ method: 'resolveDID', params: { did } }, this.snapId);
}

/**
 * Create a Verifiable Presentation
 */
export async function createVC(
  this: Masca,
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

/**
 * Set the currently selected MetaMask account
 */
export async function setCurrentAccount(
  this: Masca,
  params: SetCurrentAccountRequestParams
): Promise<Result<boolean>> {
  return sendSnapMethod(
    {
      method: 'setCurrentAccount',
      params,
    },
    this.snapId
  );
}

export async function handleOIDCCredentialOffer(
  this: Masca,
  params: HandleOIDCCredentialOfferRequestParams
): Promise<Result<VerifiableCredential>> {
  return sendSnapMethod(
    {
      method: 'handleOIDCCredentialOffer',
      params,
    },
    this.snapId
  );
}

export async function handleOIDCAuthorizationRequest(
  this: Masca,
  params: HandleOIDCAuthorizationRequestParams
): Promise<Result<VerifiableCredential[]>> {
  return sendSnapMethod(
    {
      method: 'handleOIDCAuthorizationRequest',
      params,
    },
    this.snapId
  );
}

export async function sendOIDCAuthorizationResponse(
  this: Masca,
  params: SendOIDCAuthorizationResponseParams
): Promise<Result<boolean>> {
  return sendSnapMethod(
    {
      method: 'sendOIDCAuthorizationResponse',
      params,
    },
    this.snapId
  );
}

export class Masca {
  protected readonly snapId: string;

  public readonly supportedMethods: Array<AvailableMethods>;

  public constructor(
    snapId: string,
    supportedMethods: Array<AvailableMethods>
  ) {
    this.snapId = snapId;
    this.supportedMethods = supportedMethods;
  }

  public getMascaApi = (): MascaApi => ({
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
    setCurrentAccount: setCurrentAccount.bind(this),
    handleOIDCCredentialOffer: handleOIDCCredentialOffer.bind(this),
    handleOIDCAuthorizationRequest: handleOIDCAuthorizationRequest.bind(this),
    sendOIDCAuthorizationResponse: sendOIDCAuthorizationResponse.bind(this),
  });
}
