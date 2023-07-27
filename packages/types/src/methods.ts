import type {
  CreateVCRequestParams,
  CreateVPRequestParams,
  DeleteVCsRequestParams,
  HandleAuthorizationRequestParams,
  HandleCredentialOfferRequestParams,
  ImportStateBackupRequestParams,
  QueryVCsRequestParams,
  ResolveDIDRequestParams,
  SaveVCRequestParams,
  SetCeramicSessionRequestParams,
  SetCurrentAccountRequestParams,
  SetVCStoreRequestParams,
  SwitchMethodRequestParams,
  VerifyDataRequestParams,
} from './params.js';

export type QueryVCs = {
  method: 'queryVCs';
  params: QueryVCsRequestParams;
};

export type CreateVC = {
  method: 'createVC';
  params: CreateVCRequestParams;
};

export type SaveVC = {
  method: 'saveVC';
  params: SaveVCRequestParams;
};

export type DeleteVC = {
  method: 'deleteVC';
  params: DeleteVCsRequestParams;
};

export type CreateVP = {
  method: 'createVP';
  params: CreateVPRequestParams;
};

export type SetVCStore = {
  method: 'setVCStore';
  params: SetVCStoreRequestParams;
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

export type GetVCStore = {
  method: 'getVCStore';
};

export type GetAccountSettings = {
  method: 'getAccountSettings';
};

export type GetSnapSettings = {
  method: 'getSnapSettings';
};

export type GetAvailableVCStores = {
  method: 'getAvailableVCStores';
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
