import { VerifiablePresentation } from '@veramo/core';
import { AvailableMethods } from './constants';
import {
  ChangeInfuraTokenRequestParams,
  CreateVPRequestParams,
  QueryVCsRequestParams,
  SaveVCRequestParams,
  SetVCStoreRequestParams,
  SwitchMethodRequestParams,
} from './params';
import { QueryVCsRequestResult } from './results';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SSISnapEventApi {}

export interface SSISnapApi {
  queryVCs(params: QueryVCsRequestParams): Promise<QueryVCsRequestResult>;
  saveVC(params: SaveVCRequestParams): Promise<boolean>;
  createVP(params: CreateVPRequestParams): Promise<VerifiablePresentation>;
  changeInfuraToken(params: ChangeInfuraTokenRequestParams): Promise<boolean>;
  togglePopups(): Promise<boolean>;
  getDID(): Promise<string>;
  getMethod(): Promise<AvailableMethods>;
  getAvailableMethods(): Promise<AvailableMethods>;
  switchMethod(params: SwitchMethodRequestParams): Promise<boolean>;
  getVCStore(): Promise<string>;
  setVCStore(params: SetVCStoreRequestParams): Promise<boolean>;
  getAvailableVCStores(): Promise<string[]>;
}
