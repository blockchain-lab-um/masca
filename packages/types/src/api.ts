import type { Result } from '@blockchain-lab-um/utils';
import type {
  DIDResolutionResult,
  IVerifyResult,
  VerifiableCredential,
  VerifiablePresentation,
  W3CVerifiableCredential,
} from '@veramo/core';

import type {
  AvailableCredentialStores,
  AvailableMethods,
} from './constants.js';
import type {
  CreateCredentialRequestParams,
  CreatePresentationRequestParams,
  DeleteCredentialsOptions,
  HandleAuthorizationRequestParams,
  HandleCredentialOfferRequestParams,
  ImportStateBackupRequestParams,
  QueryCredentialsRequestParams,
  SaveCredentialOptions,
  SetCurrentAccountRequestParams,
  SignDataRequestParams,
  VerifyDataRequestParams,
} from './params.js';
import type {
  QueryCredentialsRequestResult,
  SaveCredentialRequestResult,
} from './results.js';
import type { MascaAccountConfig, MascaConfig } from './state.js';

export interface MascaApi {
  queryCredentials(
    params?: QueryCredentialsRequestParams
  ): Promise<Result<QueryCredentialsRequestResult[]>>;
  saveCredential(
    vc: W3CVerifiableCredential,
    options?: SaveCredentialOptions
  ): Promise<Result<SaveCredentialRequestResult[]>>;
  createPresentation(
    params: CreatePresentationRequestParams
  ): Promise<Result<VerifiablePresentation>>;
  togglePopups(): Promise<Result<boolean>>;
  getDID(): Promise<Result<string>>;
  getSelectedMethod(): Promise<Result<string>>;
  getAvailableMethods(): Promise<Result<string[]>>;
  switchDIDMethod(method: AvailableMethods): Promise<Result<AvailableMethods>>;
  getCredentialStore(): Promise<
    Result<Record<AvailableCredentialStores, boolean>>
  >;
  setCredentialStore(
    store: AvailableCredentialStores,
    value: boolean
  ): Promise<Result<boolean>>;
  getAvailableCredentialStores(): Promise<Result<string[]>>;
  deleteCredential(
    id: string,
    options?: DeleteCredentialsOptions
  ): Promise<Result<boolean[]>>;
  getAccountSettings(): Promise<Result<MascaAccountConfig>>;
  getSnapSettings(): Promise<Result<MascaConfig>>;
  resolveDID(did: string): Promise<Result<DIDResolutionResult>>;
  verifyData(
    params: VerifyDataRequestParams
  ): Promise<Result<boolean | IVerifyResult>>;
  createCredential(
    params: CreateCredentialRequestParams
  ): Promise<Result<VerifiableCredential>>;
  setCurrentAccount(
    params: SetCurrentAccountRequestParams
  ): Promise<Result<boolean>>;
  handleCredentialOffer(
    params: HandleCredentialOfferRequestParams
  ): Promise<Result<VerifiableCredential[]>>;
  handleAuthorizationRequest(
    params: HandleAuthorizationRequestParams
  ): Promise<Result<void>>;
  setCeramicSession(serializedSession: string): Promise<Result<boolean>>;
  validateStoredCeramicSession(): Promise<Result<boolean>>;
  addTrustedDapp(origin: string): Promise<Result<boolean>>;
  removeTrustedDapp(origin: string): Promise<Result<boolean>>;
  importStateBackup(
    params: ImportStateBackupRequestParams
  ): Promise<Result<boolean>>;
  exportStateBackup(): Promise<Result<string>>;
  getWalletId(): Promise<Result<string>>;
  signData(params: SignDataRequestParams): Promise<Result<string>>;
}
