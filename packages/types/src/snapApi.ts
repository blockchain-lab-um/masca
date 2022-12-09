import { VerifiablePresentation, W3CVerifiableCredential } from '@veramo/core';
import { AvailableMethods, AvailableVCStores } from './constants';
import {
  CreateVPRequestParams,
  QueryVCsRequestParams,
  SaveVCOptions,
} from './params';
import { QueryVCsRequestResult } from './results';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SSISnapEventApi {}

export interface SSISnapApi {
  queryVCs(params?: QueryVCsRequestParams): Promise<QueryVCsRequestResult[]>;
  saveVC(
    vc: W3CVerifiableCredential,
    options?: SaveVCOptions
  ): Promise<boolean>;
  createVP(params: CreateVPRequestParams): Promise<VerifiablePresentation>;
  changeInfuraToken(infuraToken: string): Promise<boolean>;
  togglePopups(): Promise<boolean>;
  getDID(): Promise<string>;
  getSelectedMethod(): Promise<AvailableMethods>;
  getAvailableMethods(): Promise<AvailableMethods>;
  switchDIDMethod(method: AvailableMethods): Promise<boolean>;
  getVCStore(): Promise<string>;
  setVCStore(store: AvailableVCStores, value: boolean): Promise<boolean>;
  getAvailableVCStores(): Promise<string[]>;
}
