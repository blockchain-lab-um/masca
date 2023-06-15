import type {
  CreateVCRequestParams,
  CreateVPRequestParams,
  DeleteVCsRequestParams,
  HandleOIDCAuthorizationRequestParams,
  HandleOIDCCredentialOfferRequestParams,
  QueryVCsRequestParams,
  ResolveDIDRequestParams,
  SaveVCRequestParams,
  SendOIDCAuthorizationResponseParams,
  SetCeramicSessionKeyRequestParams,
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

export type HandleOIDCCredentialOffer = {
  method: 'handleOIDCCredentialOffer';
  params: HandleOIDCCredentialOfferRequestParams;
};

export type HandleOIDCAuthorizationRequest = {
  method: 'handleOIDCAuthorizationRequest';
  params: HandleOIDCAuthorizationRequestParams;
};

export type SendOIDCAuthorizationResponse = {
  method: 'sendOIDCAuthorizationResponse';
  params: SendOIDCAuthorizationResponseParams;
};

export type SetCeramicSessionKey = {
  method: 'setCeramicSessionKey';
  params: SetCeramicSessionKeyRequestParams;
}

export type VerifyStoredCeramicSessionKey = {
  method: 'verifyStoredCeramicSessionKey';
}