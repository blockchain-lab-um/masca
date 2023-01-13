import {
  ChangeInfuraTokenRequestParams,
  CreateVPRequestParams,
  DeleteVCsRequestParams,
  QueryVCsRequestParams,
  ResolveDIDRequestParams,
  SaveVCRequestParams,
  SetVCStoreRequestParams,
  SwitchMethodRequestParams,
} from './params';

export type QueryVCs = {
  method: 'queryVCs';
  params: QueryVCsRequestParams;
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

export type ChangeInfuraToken = {
  method: 'changeInfuraToken';
  params: ChangeInfuraTokenRequestParams;
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
