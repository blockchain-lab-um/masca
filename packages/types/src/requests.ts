import type {
  AddFriendlyDapp,
  CreateCredential,
  CreatePresentation,
  DeleteCredential,
  ExportStateBackup,
  GetAccountSettings,
  GetAvailableCredentialStores,
  GetAvailableMethods,
  GetCredentialStore,
  GetDID,
  GetMethod,
  GetSnapSettings,
  GetWalletId,
  HandleAuthorization,
  HandleCredentialOffer,
  ImportStateBackup,
  QueryCredentials,
  RemoveFriendlyDapp,
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
  | AddFriendlyDapp
  | RemoveFriendlyDapp
  | GetDID
  | GetMethod
  | GetAvailableMethods
  | SwitchMethod
  | GetCredentialStore
  | SetCredentialStore
  | GetAvailableCredentialStores
  | GetAccountSettings
  | GetSnapSettings
  | GetWalletId
  | ResolveDID
  | CreateCredential
  | SetCurrentAccount
  | VerifyData
  | HandleCredentialOffer
  | HandleAuthorization
  | SetCeramicSession
  | ValidateStoredCeramicSession
  | ExportStateBackup
  | ImportStateBackup;

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
