import type {
  CreateCredential,
  CreatePresentation,
  DeleteCredential,
  GetAccountSettings,
  GetAvailableCredentialStores,
  GetAvailableMethods,
  GetCredentialStore,
  GetDID,
  GetMethod,
  GetSnapSettings,
  HandleAuthorization,
  HandleCredentialOffer,
  QueryCredentials,
  ResolveDID,
  SaveCredential,
  SetCeramicSession,
  SetCredentialStore,
  SetCurrentAccount,
  SwitchMethod,
  TogglePopups,
  ValidateStoredCeramicSession,
  VerifyData,
} from './methods.js';

export type MascaRPCRequest =
  | QueryCredentials
  | SaveCredential
  | CreatePresentation
  | DeleteCredential
  | TogglePopups
  | GetDID
  | GetMethod
  | GetAvailableMethods
  | SwitchMethod
  | GetCredentialStore
  | SetCredentialStore
  | GetAvailableCredentialStores
  | GetAccountSettings
  | GetSnapSettings
  | ResolveDID
  | CreateCredential
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
