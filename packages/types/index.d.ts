import { VerifiableCredential, VerifiablePresentation } from '@veramo/core';

export interface GetVCs {
  method: 'getVCs';
  params: {
    query?: VCQuery;
  };
}

export interface SaveVC {
  method: 'saveVC';
  params: {
    verifiableCredential: VerifiableCredential;
  };
}

export interface GetVP {
  method: 'getVP';
  params: {
    vcId: string;
    domain?: string;
    challenge?: string;
  };
}

export interface ChangeInfuraToken {
  method: 'changeInfuraToken';
  params: {
    infuraToken: string;
  };
}

export interface TogglePopups {
  method: 'togglePopups';
}

export interface GetDID {
  method: 'getDID';
}

export interface GetMethod {
  method: 'getMethod';
}

export interface GetAvailableMethods {
  method: 'getAvailableMethods';
}

export interface SwitchMethod {
  method: 'switchMethod';
  params: {
    didMethod: string;
  };
}

export interface GetVCStore {
  method: 'getVCStore';
}

export interface SetVCStore {
  method: 'setVCStore';
  params: {
    vcStore: string;
  };
}

export interface GetAvailableVCStores {
  method: 'getAvailableVCStores';
}

export type MetaMaskSSISnapRPCRequest =
  | GetVCs
  | SaveVC
  | GetVP
  | ChangeInfuraToken
  | TogglePopups
  | GetDID
  | GetMethod
  | GetAvailableMethods
  | SwitchMethod
  | GetVCStore
  | SetVCStore
  | GetAvailableVCStores;

type Method = MetaMaskSSISnapRPCRequest['method'];

export interface WalletEnableRequest {
  method: 'wallet_enable';
  params: object[];
}

export interface GetSnapsRequest {
  method: 'wallet_getSnaps';
}

export interface SnapRpcMethodRequest {
  method: string;
  params: [MetaMaskSSISnapRPCRequest];
}

export type MetamaskRpcRequest =
  | WalletEnableRequest
  | GetSnapsRequest
  | SnapRpcMethodRequest;

export type Callback<T> = (arg: T) => void;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SSISnapEventApi {}

export interface SSISnapApi {
  getVCs(query?: VCQuery): Promise<VerifiableCredential[]>;
  saveVC(verifiableCredential: VerifiableCredential): Promise<boolean>;
  getVP(
    vcId: string,
    domain?: string,
    challenge?: string
  ): Promise<VerifiablePresentation>;
  changeInfuraToken(infuraToken: string): Promise<boolean>;
  togglePopups(): Promise<boolean>;
  getDID(): Promise<string>;
  getMethod(): Promise<string>;
  getAvailableMethods(): Promise<string[]>;
  switchMethod(didMethod: string): Promise<boolean>;
  getVCStore(): Promise<string>;
  setVCStore(vcStore: string): Promise<boolean>;
  getAvailableVCStores(): Promise<string[]>;
}

export interface VCQuery {
  [key: string]: string;
}
