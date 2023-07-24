import type {
  AvailableMethods,
  AvailableVCStores,
  CreateVCRequestParams,
  CreateVPRequestParams,
  DeleteVCsOptions,
  HandleAuthorizationRequestParams,
  HandleCredentialOfferRequestParams,
  MascaAccountConfig,
  MascaApi,
  MascaConfig,
  MascaRPCRequest,
  QueryVCsRequestParams,
  QueryVCsRequestResult,
  SaveVCOptions,
  SaveVCRequestResult,
  SetCurrentAccountRequestParams,
  VerifyDataRequestParams,
} from '@blockchain-lab-um/masca-types';
import { isError, ResultObject, type Result } from '@blockchain-lab-um/utils';
import type {
  DIDResolutionResult,
  IVerifyResult,
  VerifiableCredential,
  VerifiablePresentation,
  W3CVerifiableCredential,
} from '@veramo/core';

import {
  signVerifiableCredential,
  signVerifiablePresentation,
  validateAndSetCeramicSession,
} from './utils.js';

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
  await validateAndSetCeramicSession(this);

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
  await validateAndSetCeramicSession(this);

  const result = await sendSnapMethod<Result<VerifiablePresentation>>(
    {
      method: 'createVP',
      params,
    },
    this.snapId
  );

  if (isError(result)) {
    return result;
  }

  if (result.data.proof) {
    return result;
  }

  const signedResult = ResultObject.success(
    await signVerifiablePresentation(result.data)
  );

  return signedResult;
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
  await validateAndSetCeramicSession(this);

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
  await validateAndSetCeramicSession(this);

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
  await validateAndSetCeramicSession(this);

  const result = await sendSnapMethod(
    {
      method: 'createVC',
      params,
    },
    this.snapId
  );

  const vcResult = result as Result<VerifiableCredential>;

  if (isError(vcResult)) {
    return vcResult;
  }

  if (vcResult.data.proof) {
    return vcResult;
  }

  const signedResult = ResultObject.success(
    await signVerifiableCredential(vcResult.data)
  );

  return signedResult;
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

/**
 * Verify VC/VP
 */
export async function verifyData(
  this: Masca,
  params: VerifyDataRequestParams
): Promise<Result<boolean | IVerifyResult>> {
  return sendSnapMethod(
    {
      method: 'verifyData',
      params,
    },
    this.snapId
  );
}

export async function handleCredentialOffer(
  this: Masca,
  params: HandleCredentialOfferRequestParams
): Promise<Result<VerifiableCredential[]>> {
  return sendSnapMethod(
    {
      method: 'handleCredentialOffer',
      params,
    },
    this.snapId
  );
}

export async function handleAuthorizationRequest(
  this: Masca,
  params: HandleAuthorizationRequestParams
): Promise<Result<void>> {
  return sendSnapMethod(
    {
      method: 'handleAuthorizationRequest',
      params,
    },
    this.snapId
  );
}

export async function setCeramicSession(
  this: Masca,
  serializedSession: string
): Promise<Result<boolean>> {
  return sendSnapMethod(
    {
      method: 'setCeramicSession',
      params: { serializedSession },
    },
    this.snapId
  );
}

export async function validateStoredCeramicSession(
  this: Masca
): Promise<Result<boolean>> {
  return sendSnapMethod(
    {
      method: 'validateStoredCeramicSession',
    },
    this.snapId
  );
}

const wrapper =
  <T extends any[], R>(fn: (...args: T) => Promise<Result<R>>) =>
  async (...args: T): Promise<Result<R>> => {
    try {
      return await fn(...args);
    } catch (e) {
      return ResultObject.error((e as Error).toString());
    }
  };

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
    saveVC: wrapper(saveVC.bind(this)),
    queryVCs: wrapper(queryVCs.bind(this)),
    createVP: wrapper(createVP.bind(this)),
    togglePopups: wrapper(togglePopups.bind(this)),
    getDID: wrapper(getDID.bind(this)),
    getSelectedMethod: wrapper(getSelectedMethod.bind(this)),
    getAvailableMethods: wrapper(getAvailableMethods.bind(this)),
    switchDIDMethod: wrapper(switchDIDMethod.bind(this)),
    getVCStore: wrapper(getVCStore.bind(this)),
    setVCStore: wrapper(setVCStore.bind(this)),
    getAvailableVCStores: wrapper(getAvailableVCStores.bind(this)),
    deleteVC: wrapper(deleteVC.bind(this)),
    getSnapSettings: wrapper(getSnapSettings.bind(this)),
    getAccountSettings: wrapper(getAccountSettings.bind(this)),
    resolveDID: wrapper(resolveDID.bind(this)),
    createVC: wrapper(createVC.bind(this)),
    setCurrentAccount: wrapper(setCurrentAccount.bind(this)),
    verifyData: wrapper(verifyData.bind(this)),
    handleCredentialOffer: wrapper(handleCredentialOffer.bind(this)),
    handleAuthorizationRequest: wrapper(handleAuthorizationRequest.bind(this)),
    setCeramicSession: wrapper(setCeramicSession.bind(this)),
    validateStoredCeramicSession: wrapper(
      validateStoredCeramicSession.bind(this)
    ),
  });
}
