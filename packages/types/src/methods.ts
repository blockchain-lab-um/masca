import type {
  CreateCredentialRequestParams,
  CreatePresentationRequestParams,
  DeleteCredentialsRequestParams,
  HandleAuthorizationRequestParams,
  HandleCredentialOfferRequestParams,
  ImportStateBackupRequestParams,
  QueryCredentialsRequestParams,
  RemoveFriendlyDappParams,
  ResolveDIDRequestParams,
  SaveCredentialRequestParams,
  SetCeramicSessionRequestParams,
  SetCredentialStoreRequestParams,
  SetCurrentAccountRequestParams,
  SwitchMethodRequestParams,
  VerifyDataRequestParams,
  SetGoogleTokenRequestParams,
} from './params.js';

export type QueryCredentials = {
  method: 'queryCredentials';
  params: QueryCredentialsRequestParams;
};

export type CreateCredential = {
  method: 'createCredential';
  params: CreateCredentialRequestParams;
};

export type SaveCredential = {
  method: 'saveCredential';
  params: SaveCredentialRequestParams;
};

export type DeleteCredential = {
  method: 'deleteCredential';
  params: DeleteCredentialsRequestParams;
};

export type CreatePresentation = {
  method: 'createPresentation';
  params: CreatePresentationRequestParams;
};

export type SetCredentialStore = {
  method: 'setCredentialStore';
  params: SetCredentialStoreRequestParams;
};

export type SwitchMethod = {
  method: 'switchDIDMethod';
  params: SwitchMethodRequestParams;
};

export type TogglePopups = {
  method: 'togglePopups';
};

export type GetDID = {
  method: 'getDID';
};

export type GetMethod = {
  method: 'getSelectedMethod';
};

export type GetAvailableMethods = {
  method: 'getAvailableMethods';
};

export type GetCredentialStore = {
  method: 'getCredentialStore';
};

export type GetAccountSettings = {
  method: 'getAccountSettings';
};

export type GetSnapSettings = {
  method: 'getSnapSettings';
};

export type GetAvailableCredentialStores = {
  method: 'getAvailableCredentialStores';
};

export type ResolveDID = {
  method: 'resolveDID';
  params: ResolveDIDRequestParams;
};

export type VerifyData = {
  method: 'verifyData';
  params: VerifyDataRequestParams;
};

export type SetCurrentAccount = {
  method: 'setCurrentAccount';
  params: SetCurrentAccountRequestParams;
};

export type HandleCredentialOffer = {
  method: 'handleCredentialOffer';
  params: HandleCredentialOfferRequestParams;
};

export type HandleAuthorization = {
  method: 'handleAuthorizationRequest';
  params: HandleAuthorizationRequestParams;
};

export type SetCeramicSession = {
  method: 'setCeramicSession';
  params: SetCeramicSessionRequestParams;
};

export type ValidateStoredCeramicSession = {
  method: 'validateStoredCeramicSession';
};

export type ExportStateBackup = {
  method: 'exportStateBackup';
};

export type ImportStateBackup = {
  method: 'importStateBackup';
  params: ImportStateBackupRequestParams;
};

export type AddFriendlyDapp = {
  method: 'addFriendlyDapp';
};

export type RemoveFriendlyDapp = {
  method: 'removeFriendlyDapp';
  params: RemoveFriendlyDappParams;
};

export type SetGoogleToken = {
  method: 'setGoogleToken';
  params: SetGoogleTokenRequestParams;
};

export type CreateGoogleBackup = {
  method: 'createGoogleBackup';
};

export type ImportGoogleBackup = {
  method: 'importGoogleBackup';
};
