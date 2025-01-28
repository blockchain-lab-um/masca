import type {
  AddDappSettingsRequestParams,
  AddTrustedDappRequestParams,
  ChangePermissionsRequestParams,
  CreateCredentialRequestParams,
  CreatePresentationRequestParams,
  DecodeSdJwtPresentationRequestParams,
  DeleteCredentialsRequestParams,
  HandleAuthorizationRequestParams,
  HandleCredentialOfferRequestParams,
  ImportStateBackupRequestParams,
  QueryCredentialsRequestParams,
  RemoveDappSettingsRequestParams,
  RemoveTrustedDappRequestParams,
  ResolveDIDRequestParams,
  SaveCredentialRequestParams,
  SetCeramicSessionRequestParams,
  SetCredentialStoreRequestParams,
  SetCurrentAccountRequestParams,
  SignDataRequestParams,
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

export interface DecodeSdJwtPresentation {
  method: 'decodeSdJwtPresentation';
  params: DecodeSdJwtPresentationRequestParams;
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

export interface AddTrustedDapp {
  method: 'addTrustedDapp';
  params: AddTrustedDappRequestParams;
}

export interface RemoveTrustedDapp {
  method: 'removeTrustedDapp';
  params: RemoveTrustedDappRequestParams;
}

export interface ChangePermission {
  method: 'changePermission';
  params: ChangePermissionsRequestParams;
}

export interface AddDappSettings {
  method: 'addDappSettings';
  params: AddDappSettingsRequestParams;
}

export interface RemoveDappSettings {
  method: 'removeDappSettings';
  params: RemoveDappSettingsRequestParams;
}

export interface GetWalletId {
  method: 'getWalletId';
}

export interface SignData {
  method: 'signData';
  params: SignDataRequestParams;
}
