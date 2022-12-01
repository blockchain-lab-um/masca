import { VerifiableCredential, VerifiablePresentation } from '@veramo/core';
import { ChangeInfuraTokenRequestParams, CreateVPRequestParams, QueryRequestParams, SaveVCRequestParams, SetVCStoreRequestParams, SwitchMethodRequestParams } from './params';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SSISnapEventApi {}

export interface SSISnapApi {
  queryVCs(params: QueryRequestParams): Promise<VerifiableCredential[]>;
  saveVC(params: SaveVCRequestParams): Promise<boolean>;
  createVP(params: CreateVPRequestParams): Promise<VerifiablePresentation>;
  changeInfuraToken(params: ChangeInfuraTokenRequestParams): Promise<boolean>;
  togglePopups(): Promise<boolean>;
  getDID(): Promise<string>;
  getMethod(): Promise<string>;
  getAvailableMethods(): Promise<string[]>;
  switchMethod(params: SwitchMethodRequestParams): Promise<boolean>;
  getVCStore(): Promise<string>;
  setVCStore(params: SetVCStoreRequestParams): Promise<boolean>;
  getAvailableVCStores(): Promise<string[]>;
}
