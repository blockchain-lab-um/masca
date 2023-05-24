import {
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
  HandleOIDCAuthorizationRequest,
  HandleOIDCCredentialOffer,
  QueryVCs,
  ResolveDID,
  SaveVC,
  SendOIDCAuthorizationResponse,
  SetCurrentAccount,
  SetVCStore,
  SwitchMethod,
  TogglePopups,
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
  | HandleOIDCCredentialOffer
  | HandleOIDCAuthorizationRequest
  | SendOIDCAuthorizationResponse;

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
