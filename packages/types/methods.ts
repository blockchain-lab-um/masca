import {
  ChangeInfuraTokenRequestParams,
  CreateVPRequestParams,
  DeleteVCRequestParams,
  QueryRequestParams,
  SaveVCRequestParams,
  SetVCStoreRequestParams,
  SwitchMethodRequestParams,
} from './params';

export interface VCQuery {
  [key: string]: string;
}

export interface QueryVCs {
  method: 'query';
  params: QueryRequestParams;
}

export interface SaveVC {
  method: 'saveVC';
  params: SaveVCRequestParams;
}

export interface DeleteVC {
  method: 'deleteVC';
  params: DeleteVCRequestParams;
}

export interface CreateVP {
  method: 'createVP';
  params: CreateVPRequestParams;
}

export interface ChangeInfuraToken {
  method: 'changeInfuraToken';
  params: ChangeInfuraTokenRequestParams;
}

export interface SetVCStore {
  method: 'setVCStore';
  params: SetVCStoreRequestParams;
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

export interface GetVCStore {
  method: 'getVCStore';
}

export interface GetAccountSettings {
  method: 'getAccountSettings';
}

export interface GetSnapSettings {
  method: 'getSnapSettings';
}

export interface GetAvailableVCStores {
  method: 'getAvailableVCStores';
}
