import type {
  AvailableCredentialStores,
  AvailableMethods,
  CreateCredentialRequestParams,
  CreatePresentationRequestParams,
  DecodeSdJwtPresentationRequestParams,
  DeleteCredentialsOptions,
  HandleAuthorizationRequestParams,
  HandleCredentialOfferRequestParams,
  ImportStateBackupRequestParams,
  MascaAccountConfig,
  MascaApi,
  MascaConfig,
  MascaRPCRequest,
  QueryCredentialsRequestParams,
  QueryCredentialsRequestResult,
  SaveCredentialOptions,
  SaveCredentialRequestResult,
  SdJwtCredential,
  SetCurrentAccountRequestParams,
  SignDataRequestParams,
  VerifyDataRequestParams,
} from '@blockchain-lab-um/masca-types';
import { type Result, ResultObject, isError } from '@blockchain-lab-um/utils';
import type {
  DIDResolutionResult,
  IVerifyResult,
  VerifiableCredential,
  VerifiablePresentation,
  W3CVerifiableCredential,
} from '@veramo/core';

import { ProviderStore } from './ProviderStore.js';
import { ViemClient } from './ViemClient.js';
import {
  signVerifiableCredential,
  signVerifiablePresentation,
  validateAndSetCeramicSession,
} from './utils.js';

/**
 * Send a request to the Masca snap
 * @param request - request to be sent
 * @param snapId - snap ID
 * @returns Result<T> - result of the request
 * @throws Error - if the request fails
 */
async function sendSnapMethod<T>(
  context: Masca,
  request: MascaRPCRequest,
  snapId: string
): Promise<T> {
  const provider = context.providerStore.getCurrentProvider()?.provider;
  if (!provider) throw new Error('No provider found');
  // FIXME: currently the wallet_requestSnaps is not in type of EIP-1193 provider since its not standard
  // therefore "as unknown as any" is used to bypass the type check
  return provider.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId,
      request,
    },
  } as unknown as any);
}

/**
 * Get a list of VCs stored in Masca under the currently selected MetaMask account
 * @param params - optional parameters for querying VCs
 *
 * @return Result<QueryCredentialsRequestResult[]> - list of VCs
 */
async function queryCredentials(
  this: Masca,
  params?: QueryCredentialsRequestParams
): Promise<Result<QueryCredentialsRequestResult[]>> {
  await validateAndSetCeramicSession.bind(this)();

  return sendSnapMethod(
    this,
    { method: 'queryCredentials', params: params ?? {} },
    this.snapId
  );
}

/**
 * Create a VP from one or more VCs passed as parameters
 * @param params - parameters for creating a VP
 * @return Result<VerifiablePresentation> - VP
 */
async function createPresentation(
  this: Masca,
  params: CreatePresentationRequestParams
): Promise<Result<VerifiablePresentation>> {
  await validateAndSetCeramicSession.bind(this)();

  const result = await sendSnapMethod<Result<VerifiablePresentation>>(
    this,
    {
      method: 'createPresentation',
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
    await signVerifiablePresentation.bind(this)(result.data)
  );

  return signedResult;
}

/**
 * Decode a SD-JWT presentation
 * @param params - parameters for decoding a SD-JWT presentation
 * @return Result<SDJwtCredential> - decoded SD-JWT presentation
 */
async function decodeSdJwtPresentation(
  this: Masca,
  params: DecodeSdJwtPresentationRequestParams
): Promise<Result<SdJwtCredential[]>> {
  return sendSnapMethod<any>(
    this,
    {
      method: 'decodeSdJwtPresentation',
      params: {
        ...params,
      },
    },
    this.snapId
  );
}

/**
 * Save a VC in Masca under the currently selected MetaMask account
 * @param vc - VC to be saved
 * @param options - optional parameters for saving a VC
 *
 * @return Result<SaveCredentialRequestResult[]> - list of saved VCs
 */
async function saveCredential(
  this: Masca,
  vc: W3CVerifiableCredential,
  options?: SaveCredentialOptions
): Promise<Result<SaveCredentialRequestResult[]>> {
  await validateAndSetCeramicSession.bind(this)();

  return sendSnapMethod(
    this,
    {
      method: 'saveCredential',
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
 * @param id - ID of the VC to be deleted
 * @param options - optional parameters for deleting a VC
 * @return Result<boolean[]> - list of results for each VC
 */
async function deleteCredential(
  this: Masca,
  id: string,
  options?: DeleteCredentialsOptions
): Promise<Result<boolean[]>> {
  await validateAndSetCeramicSession.bind(this)();

  return sendSnapMethod(
    this,
    {
      method: 'deleteCredential',
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
 * @return Result<string> - DID
 */
async function getDID(this: Masca): Promise<Result<string>> {
  return sendSnapMethod(this, { method: 'getDID' }, this.snapId);
}

/**
 * Get the currently selected DID method
 * @return Result<string> - DID method
 */
async function getSelectedMethod(this: Masca): Promise<Result<string>> {
  return sendSnapMethod(this, { method: 'getSelectedMethod' }, this.snapId);
}

/**
 * Get a list of available DID methods
 * @return Result<string[]> - list of available DID methods
 */
async function getAvailableMethods(this: Masca): Promise<Result<string[]>> {
  return sendSnapMethod(this, { method: 'getAvailableMethods' }, this.snapId);
}

/**
 * Switch the currently selected DID method
 * @param method - DID method to be switched to
 * @return Result<boolean> - true if the switch was successful
 */
async function switchDIDMethod(
  this: Masca,
  method: AvailableMethods
): Promise<Result<AvailableMethods>> {
  if (this.supportedMethods.includes(method)) {
    return sendSnapMethod(
      this,
      { method: 'switchDIDMethod', params: { didMethod: method } },
      this.snapId
    );
  }
  return ResultObject.error(`Method ${method} is not supported on this dapp.`);
}

/**
 * Enables/disables confirmation popup windows when retrieving VCs, generating VPs,...
 * @return Result<boolean> - true if the switch was successful
 */
async function togglePopups(this: Masca): Promise<Result<boolean>> {
  return sendSnapMethod(this, { method: 'togglePopups' }, this.snapId);
}

/**
 * Adds origin of the current dapp to the list of trusted dapps. This will disable popups from appearing while using the dapp.
 *
 * @return Result<boolean> - true if the addition was successful
 */
async function addTrustedDapp(
  this: Masca,
  origin: string
): Promise<Result<boolean>> {
  return sendSnapMethod(
    this,
    { method: 'addTrustedDapp', params: { origin } },
    this.snapId
  );
}

/**
 * Removes origin of the current dapp from the list of trusted dapps. This will enable popups while using the dapp.
 *
 * @return Result<boolean> - true if the removal was successful
 */
async function removeTrustedDapp(
  this: Masca,
  origin: string
): Promise<Result<boolean>> {
  return sendSnapMethod(
    this,
    { method: 'removeTrustedDapp', params: { origin } },
    this.snapId
  );
}

/**
 * Adds a dapp to the settings list.
 *
 * @return Result<boolean> - true if the addition was successful
 */
async function addDappSettings(
  this: Masca,
  origin: string
): Promise<Result<boolean>> {
  return sendSnapMethod(
    this,
    { method: 'addDappSettings', params: { origin } },
    this.snapId
  );
}

/**
 * Removes a dapp from the settings list.
 *
 * @return Result<boolean> - true if the addition was successful
 */
async function removeDappSettings(
  this: Masca,
  origin: string
): Promise<Result<boolean>> {
  return sendSnapMethod(
    this,
    { method: 'removeDappSettings', params: { origin } },
    this.snapId
  );
}

/**
 * Modify permissions for a specific RPC method on a specific dApp. This will disable/enable popups for said method.
 *
 * Currently changing permissions is only supported for the queryCredentials method.
 *
 * This method is only available on https://masca.io & https://beta.masca.io
 *
 * @return Result<boolean> - true if the removal was successful
 */
async function changePermission(
  this: Masca,
  origin: string,
  method: 'queryCredentials',
  value: boolean
): Promise<Result<boolean>> {
  return sendSnapMethod(
    this,
    { method: 'changePermission', params: { origin, method, value } },
    this.snapId
  );
}

/**
 * Get the status of available VC stores (i.e. whether they are enabled or not)
 *
 * @return Result<Record<AvailableCredentialStores, boolean>> - status of available VC stores
 */
async function getCredentialStore(
  this: Masca
): Promise<Result<Record<AvailableCredentialStores, boolean>>> {
  return sendSnapMethod(this, { method: 'getCredentialStore' }, this.snapId);
}

/**
 * Get a list of available VC stores
 * @return Result<string[]> - list of available VC stores
 */
async function getAvailableCredentialStores(
  this: Masca
): Promise<Result<string[]>> {
  return sendSnapMethod(
    this,
    { method: 'getAvailableCredentialStores' },
    this.snapId
  );
}

/**
 * Enables/disables a VC store
 * @param store - VC store to be enabled/disabled
 * @param value - true to enable, false to disable
 * @return Result<boolean> - true if the switch was successful
 */
async function setCredentialStore(
  this: Masca,
  store: AvailableCredentialStores,
  value: boolean
): Promise<Result<boolean>> {
  return sendSnapMethod(
    this,
    { method: 'setCredentialStore', params: { store, value } },
    this.snapId
  );
}

/**
 * Get account settings of currently selected account (i.e. DID method, VC stores,...)
 * @return Result<MascaAccountConfig> - account settings
 */
async function getAccountSettings(
  this: Masca
): Promise<Result<MascaAccountConfig>> {
  return sendSnapMethod(this, { method: 'getAccountSettings' }, this.snapId);
}

/**
 * Get Masca settings
 * @return Result<MascaConfig> - Masca settings
 */
async function getSnapSettings(this: Masca): Promise<Result<MascaConfig>> {
  return sendSnapMethod(this, { method: 'getSnapSettings' }, this.snapId);
}

/**
 * Resolve a DID
 * @param did - DID to be resolved
 * @return Result<DIDResolutionResult> - DID resolution result
 */
async function resolveDID(
  this: Masca,
  did: string
): Promise<Result<DIDResolutionResult>> {
  return sendSnapMethod(
    this,
    { method: 'resolveDID', params: { did } },
    this.snapId
  );
}

/**
 * Create a Verifiable Credential
 * @param this - Masca instance
 * @param params - object with parameters for creating a Verifiable Credential
 */
async function createCredential(
  this: Masca,
  params: CreateCredentialRequestParams
): Promise<Result<VerifiableCredential>> {
  await validateAndSetCeramicSession.bind(this)();

  const result = await sendSnapMethod(
    this,
    {
      method: 'createCredential',
      params,
    },
    this.snapId
  );

  const vcResult = result as Result<VerifiableCredential>;

  // Fix (no issuer id): the sd-jwt has iss value and not issuer with id value
  if (vcResult.success && vcResult.data.proofType === 'sd-jwt') {
    return vcResult;
  }

  if (isError(vcResult)) {
    return vcResult;
  }

  const signedResult = ResultObject.success(
    await signVerifiableCredential.bind(this)(vcResult.data, params)
  );

  return signedResult;
}

/**
 * Set the currently selected MetaMask account
 * @param this - Masca instance
 * @param params.currentAccount - account address
 * @returns Result<boolean> - true if successful
 */
async function setCurrentAccount(
  this: Masca,
  params: SetCurrentAccountRequestParams
): Promise<Result<boolean>> {
  return sendSnapMethod(
    this,
    {
      method: 'setCurrentAccount',
      params,
    },
    this.snapId
  );
}

/**
 * Verify a Credential or a Presentation
 * @param this - Masca instance
 * @param params - a Credential or a Presentation with optional verbose flag
 * @returns Result<boolean | IVerifyResult> - true if the Credential/Presentation is valid, false otherwise
 */
async function verifyData(
  this: Masca,
  params: VerifyDataRequestParams
): Promise<Result<boolean | IVerifyResult>> {
  return sendSnapMethod(
    this,
    {
      method: 'verifyData',
      params,
    },
    this.snapId
  );
}

/**
 * Handle a Credential Offer
 * @param this - Masca instance
 * @param params.credentialOffer - Credential Offer string
 * @returns Result<VerifiableCredential[]> - list of VCs if successful
 */
async function handleCredentialOffer(
  this: Masca,
  params: HandleCredentialOfferRequestParams
): Promise<Result<VerifiableCredential[]>> {
  return sendSnapMethod(
    this,
    {
      method: 'handleCredentialOffer',
      params,
    },
    this.snapId
  );
}

/**
 * Handle an Authorization Request
 * @param this - Masca instance
 * @param params.authorizationRequest - Authorization Request string
 * @returns Result<void> - void if successful
 */
async function handleAuthorizationRequest(
  this: Masca,
  params: HandleAuthorizationRequestParams
): Promise<Result<void>> {
  return sendSnapMethod(
    this,
    {
      method: 'handleAuthorizationRequest',
      params,
    },
    this.snapId
  );
}

/**
 * Set the Ceramic session
 * @param this - Masca instance
 * @param serializedSession - serialized Ceramic session
 * @returns Result<boolean> - true if successful
 */
async function setCeramicSession(
  this: Masca,
  serializedSession: string
): Promise<Result<boolean>> {
  return sendSnapMethod(
    this,
    {
      method: 'setCeramicSession',
      params: { serializedSession },
    },
    this.snapId
  );
}

/**
 * Validate the stored Ceramic session
 * @param this - Masca instance
 * @returns Result<boolean> - true if successful
 */
async function validateStoredCeramicSession(
  this: Masca
): Promise<Result<boolean>> {
  return sendSnapMethod(
    this,
    {
      method: 'validateStoredCeramicSession',
    },
    this.snapId
  );
}

/**
 * Export Masca state
 * @param this - Masca instance
 * @returns Result<string> - Encrypted Masca state
 */
async function exportStateBackup(this: Masca): Promise<Result<string>> {
  return sendSnapMethod(
    this,
    {
      method: 'exportStateBackup',
    },
    this.snapId
  );
}

/**
 * Import encrypted Masca state
 * @param this - Masca instance
 * @param params - Encrypted Masca state
 * @returns Result<boolean> - true if successful
 */
async function importStateBackup(
  this: Masca,
  params: ImportStateBackupRequestParams
): Promise<Result<boolean>> {
  return sendSnapMethod(
    this,
    {
      method: 'importStateBackup',
      params,
    },
    this.snapId
  );
}

/**
 * Get wallet ID
 * @param this - Masca instance
 * @returns Result<string> - walletId string if successful
 */
async function getWalletId(this: Masca): Promise<Result<string>> {
  return sendSnapMethod(
    this,
    {
      method: 'getWalletId',
    },
    this.snapId
  );
}

/**
 * Sign data (JWT or JWZ)
 * @param this - Masca instance
 * @returns Result<string> - signed data string (JWT or JWZ) if successful
 */
async function signData(
  this: Masca,
  params: SignDataRequestParams
): Promise<Result<string>> {
  return sendSnapMethod(
    this,
    {
      method: 'signData',
      params,
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

  public readonly supportedMethods: AvailableMethods[];

  public providerStore: ProviderStore;

  public viemClient: ViemClient;

  public constructor(snapId: string, supportedMethods: AvailableMethods[]) {
    this.snapId = snapId;
    this.supportedMethods = supportedMethods;
    this.providerStore = new ProviderStore();
    this.viemClient = new ViemClient({
      provider: this.providerStore.getCurrentProvider()?.provider,
    });
  }

  public getMascaApi = (): MascaApi => ({
    saveCredential: wrapper(saveCredential.bind(this)),
    queryCredentials: wrapper(queryCredentials.bind(this)),
    createPresentation: wrapper(createPresentation.bind(this)),
    decodeSdJwtPresentation: wrapper(decodeSdJwtPresentation.bind(this)),
    togglePopups: wrapper(togglePopups.bind(this)),
    addTrustedDapp: wrapper(addTrustedDapp.bind(this)),
    removeTrustedDapp: wrapper(removeTrustedDapp.bind(this)),
    getDID: wrapper(getDID.bind(this)),
    getSelectedMethod: wrapper(getSelectedMethod.bind(this)),
    getAvailableMethods: wrapper(getAvailableMethods.bind(this)),
    switchDIDMethod: wrapper(switchDIDMethod.bind(this)),
    getCredentialStore: wrapper(getCredentialStore.bind(this)),
    setCredentialStore: wrapper(setCredentialStore.bind(this)),
    getAvailableCredentialStores: wrapper(
      getAvailableCredentialStores.bind(this)
    ),
    deleteCredential: wrapper(deleteCredential.bind(this)),
    getSnapSettings: wrapper(getSnapSettings.bind(this)),
    getAccountSettings: wrapper(getAccountSettings.bind(this)),
    resolveDID: wrapper(resolveDID.bind(this)),
    createCredential: wrapper(createCredential.bind(this)),
    setCurrentAccount: wrapper(setCurrentAccount.bind(this)),
    verifyData: wrapper(verifyData.bind(this)),
    handleCredentialOffer: wrapper(handleCredentialOffer.bind(this)),
    handleAuthorizationRequest: wrapper(handleAuthorizationRequest.bind(this)),
    setCeramicSession: wrapper(setCeramicSession.bind(this)),
    validateStoredCeramicSession: wrapper(
      validateStoredCeramicSession.bind(this)
    ),
    importStateBackup: wrapper(importStateBackup.bind(this)),
    exportStateBackup: wrapper(exportStateBackup.bind(this)),
    getWalletId: wrapper(getWalletId.bind(this)),
    signData: wrapper(signData.bind(this)),
    changePermission: wrapper(changePermission.bind(this)),
    addDappSettings: wrapper(addDappSettings.bind(this)),
    removeDappSettings: wrapper(removeDappSettings.bind(this)),
  });
}
