import type {
  CreateVC,
  CreateVP,
  DeleteVC,
  GetAccountSettings,
  GetAvailableMethods,
  GetAvailableVCStores,
  GetDID,
  GetMethod,
  GetSnapSettings,
  GetVCStore,
  HandleAuthorization,
  HandleCredentialOffer,
  QueryVCs,
  ResolveDID,
  SaveVC,
  SetCeramicSession,
  SetCurrentAccount,
  SetVCStore,
  SwitchMethod,
  TogglePopups,
  ValidateStoredCeramicSession,
  VerifyData,
} from './methods.js';

export type MascaRPCRequest =
  | QueryVCs
  | SaveVC
  | CreateVP
  | DeleteVC
  | TogglePopups
  | GetDID
  | GetMethod
  | GetAvailableMethods
  | SwitchMethod
  | GetVCStore
  | SetVCStore
  | GetAvailableVCStores
  | GetAccountSettings
  | GetSnapSettings
  | ResolveDID
  | CreateVC
  | SetCurrentAccount
  | VerifyData
  | HandleCredentialOffer
  | HandleAuthorization
  | SetCeramicSession
  | ValidateStoredCeramicSession;

export type Method = MascaRPCRequest['method'];

export interface WalletEnableRequest {
  method: 'wallet_enable';
  params: unknown[];
}

export interface GetSnapsRequest {
  method: 'wallet_getSnaps';
}

export interface SnapRpcMethodRequest {
  method: string;
  params: [MascaRPCRequest];
}

export type MetamaskRpcRequest =
  | WalletEnableRequest
  | GetSnapsRequest
  | SnapRpcMethodRequest;
