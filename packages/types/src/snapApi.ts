import { Result } from '@blockchain-lab-um/utils';
import {
  DIDResolutionResult,
  VerifiablePresentation,
  W3CVerifiableCredential,
} from '@veramo/core';

import { AvailableMethods, AvailableVCStores } from './constants.js';
import {
  CreateVPRequestParams,
  DeleteVCsOptions,
  QueryVCsRequestParams,
  SaveVCOptions,
} from './params.js';
import type { QueryVCsRequestResult, SaveVCRequestResult } from './results.js';
import { SSIAccountConfig, SSISnapConfig } from './snapInterfaces.js';

export interface SSISnapApi {
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
  getAccountSettings(): Promise<Result<SSIAccountConfig>>;
  getSnapSettings(): Promise<Result<SSISnapConfig>>;
  resolveDID(did: string): Promise<Result<DIDResolutionResult>>;
}
