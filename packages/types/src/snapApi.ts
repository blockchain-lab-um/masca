import { VerifiablePresentation, W3CVerifiableCredential } from '@veramo/core';
import { AvailableMethods, AvailableVCStores } from './constants';
import {
  CreateVPRequestParams,
  DeleteVCsOptions,
  QueryVCsRequestParams,
  SaveVCOptions,
} from './params';

import type { QueryVCsRequestResult, SaveVCRequestResult } from './results';
import { SSIAccountConfig, SSISnapConfig } from './snapInterfaces';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SSISnapEventApi {}

export interface SSISnapApi {
  queryVCs(params?: QueryVCsRequestParams): Promise<QueryVCsRequestResult[]>;
  saveVC(
    vc: W3CVerifiableCredential,
    options?: SaveVCOptions
  ): Promise<SaveVCRequestResult[]>;
  createVP(params: CreateVPRequestParams): Promise<VerifiablePresentation>;
  togglePopups(): Promise<boolean>;
  getDID(): Promise<string>;
  getSelectedMethod(): Promise<string>;
  getAvailableMethods(): Promise<string[]>;
  switchDIDMethod(method: AvailableMethods): Promise<boolean>;
  getVCStore(): Promise<Record<AvailableVCStores, boolean>>;
  setVCStore(store: AvailableVCStores, value: boolean): Promise<boolean>;
  getAvailableVCStores(): Promise<string[]>;
  deleteVC(id: string, options?: DeleteVCsOptions): Promise<boolean[]>;

  getAccountSettings(): Promise<SSIAccountConfig>;
  getSnapSettings(): Promise<SSISnapConfig>;
}
