import type {
  CreateCredentialRequestParams,
  CreatePresentationRequestParams,
  DeleteCredentialsRequestParams,
  HandleAuthorizationRequestParams,
  HandleCredentialOfferRequestParams,
  ImportStateBackupRequestParams,
  QueryCredentialsRequestParams,
  RemoveFriendlyDappRequestParams,
  ResolveDIDRequestParams,
  SaveCredentialRequestParams,
  SetCeramicSessionRequestParams,
  SetCredentialStoreRequestParams,
  SetCurrentAccountRequestParams,
  SwitchMethodRequestParams,
  VerifyDataRequestParams,
} from './params.js';

export interface QueryCredentials {
  method: 'queryCredentials';
  params: QueryCredentialsRequestParams;
}

export interface CreateCredential {
  method: 'createCredential';
  params: CreateCredentialRequestParams;
}

export interface SaveCredential {
  method: 'saveCredential';
  params: SaveCredentialRequestParams;
}

export interface DeleteCredential {
  method: 'deleteCredential';
  params: DeleteCredentialsRequestParams;
}

export interface CreatePresentation {
  method: 'createPresentation';
  params: CreatePresentationRequestParams;
}

export interface SetCredentialStore {
  method: 'setCredentialStore';
  params: SetCredentialStoreRequestParams;
}

export interface SwitchMethod {
  method: 'switchDIDMethod';
  params: SwitchMethodRequestParams;
}

export interface TogglePopups {
  method: 'togglePopups';
}

export interface GetDID {
  method: 'getDID';
}

export interface GetMethod {
  method: 'getSelectedMethod';
}

export interface GetAvailableMethods {
  method: 'getAvailableMethods';
}

export interface GetCredentialStore {
  method: 'getCredentialStore';
}

export interface GetAccountSettings {
  method: 'getAccountSettings';
}

export interface GetSnapSettings {
  method: 'getSnapSettings';
}

export interface GetAvailableCredentialStores {
  method: 'getAvailableCredentialStores';
}

export interface ResolveDID {
  method: 'resolveDID';
  params: ResolveDIDRequestParams;
}

export interface VerifyData {
  method: 'verifyData';
  params: VerifyDataRequestParams;
}

export interface SetCurrentAccount {
  method: 'setCurrentAccount';
  params: SetCurrentAccountRequestParams;
}

export interface HandleCredentialOffer {
  method: 'handleCredentialOffer';
  params: HandleCredentialOfferRequestParams;
}

export interface HandleAuthorization {
  method: 'handleAuthorizationRequest';
  params: HandleAuthorizationRequestParams;
}

export interface SetCeramicSession {
  method: 'setCeramicSession';
  params: SetCeramicSessionRequestParams;
}

export interface ValidateStoredCeramicSession {
  method: 'validateStoredCeramicSession';
}

export interface ExportStateBackup {
  method: 'exportStateBackup';
}

export interface ImportStateBackup {
  method: 'importStateBackup';
  params: ImportStateBackupRequestParams;
}

export interface AddFriendlyDapp {
  method: 'addFriendlyDapp';
}

export interface RemoveFriendlyDapp {
  method: 'removeFriendlyDapp';
  params: RemoveFriendlyDappRequestParams;
}

export interface GetWalletId {
  method: 'getWalletId';
}

export interface SignData {
  method: 'signData';
}
