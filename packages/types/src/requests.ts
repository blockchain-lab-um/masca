import type {
  AddFriendlyDapp,
  CreateCredential,
  CreateGoogleBackup,
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
  HandleAuthorization,
  HandleCredentialOffer,
  ImportGoogleBackup,
  ImportStateBackup,
  QueryCredentials,
  RemoveFriendlyDapp,
  ResolveDID,
  SaveCredential,
  SetCeramicSession,
  SetCredentialStore,
  SetCurrentAccount,
  SetGoogleToken,
  SwitchMethod,
  TogglePopups,
  ValidateStoredCeramicSession,
  ValidateStoredGoogleSession,
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
  | ResolveDID
  | CreateCredential
  | SetCurrentAccount
  | VerifyData
  | HandleCredentialOffer
  | HandleAuthorization
  | SetCeramicSession
  | ValidateStoredCeramicSession
  | ExportStateBackup
  | ImportStateBackup
  | SetGoogleToken
  | ValidateStoredGoogleSession
  | CreateGoogleBackup
  | ImportGoogleBackup;

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
