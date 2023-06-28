import type { Result } from '@blockchain-lab-um/utils';
import type {
  DIDResolutionResult,
  IVerifyResult,
  VerifiableCredential,
  VerifiablePresentation,
  W3CVerifiableCredential,
} from '@veramo/core';

import type { AvailableMethods, AvailableVCStores } from './constants.js';
import type {
  CreateVCRequestParams,
  CreateVPRequestParams,
  DeleteVCsOptions,
  HandleOIDCAuthorizationRequestParams,
  HandleOIDCCredentialOfferRequestParams,
  QueryVCsRequestParams,
  SaveVCOptions,
  SetCurrentAccountRequestParams,
  VerifyDataRequestParams,
} from './params.js';
import type { QueryVCsRequestResult, SaveVCRequestResult } from './results.js';
import type { MascaAccountConfig, MascaConfig } from './state.js';

export interface MascaApi {
  queryVCs(
    params?: QueryVCsRequestParams
  ): Promise<Result<QueryVCsRequestResult[]>>;
  saveVC(
    vc: W3CVerifiableCredential,
    options?: SaveVCOptions
  ): Promise<Result<SaveVCRequestResult[]>>;
  createVP(
    params: CreateVPRequestParams
  ): Promise<Result<VerifiablePresentation>>;
  togglePopups(): Promise<Result<boolean>>;
  getDID(): Promise<Result<string>>;
  getSelectedMethod(): Promise<Result<string>>;
  getAvailableMethods(): Promise<Result<string[]>>;
  switchDIDMethod(method: AvailableMethods): Promise<Result<AvailableMethods>>;
  getVCStore(): Promise<Result<Record<AvailableVCStores, boolean>>>;
  setVCStore(
    store: AvailableVCStores,
    value: boolean
  ): Promise<Result<boolean>>;
  getAvailableVCStores(): Promise<Result<string[]>>;
  deleteVC(id: string, options?: DeleteVCsOptions): Promise<Result<boolean[]>>;
  getAccountSettings(): Promise<Result<MascaAccountConfig>>;
  getSnapSettings(): Promise<Result<MascaConfig>>;
  resolveDID(did: string): Promise<Result<DIDResolutionResult>>;
  verifyData(
    params: VerifyDataRequestParams
  ): Promise<Result<boolean | IVerifyResult>>;
  createVC(
    params: CreateVCRequestParams
  ): Promise<Result<VerifiableCredential>>;
  setCurrentAccount(
    params: SetCurrentAccountRequestParams
  ): Promise<Result<boolean>>;
  handleOIDCCredentialOffer(
    params: HandleOIDCCredentialOfferRequestParams
  ): Promise<Result<VerifiableCredential>>;
  handleOIDCAuthorizationRequest(
    params: HandleOIDCAuthorizationRequestParams
  ): Promise<Result<VerifiableCredential[]>>;
  setCeramicSession(serializedSession: string): Promise<Result<boolean>>;
  validateStoredCeramicSession(): Promise<Result<boolean>>;
}
