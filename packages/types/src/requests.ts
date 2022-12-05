import {
  QueryVCs,
  SaveVC,
  DeleteVC,
  CreateVP,
  ChangeInfuraToken,
  TogglePopups,
  GetDID,
  GetMethod,
  GetAvailableMethods,
  SwitchMethod,
  GetVCStore,
  SetVCStore,
  GetAvailableVCStores,
  GetAccountSettings,
  GetSnapSettings,
} from './methods';

export type MetaMaskSSISnapRPCRequest =
  | QueryVCs
  | SaveVC
  | CreateVP
  | DeleteVC
  | ChangeInfuraToken
  | TogglePopups
  | GetDID
  | GetMethod
  | GetAvailableMethods
  | SwitchMethod
  | GetVCStore
  | SetVCStore
  | GetAvailableVCStores
  | GetAccountSettings
  | GetSnapSettings;

export type Method = MetaMaskSSISnapRPCRequest['method'];

export interface WalletEnableRequest {
  method: 'wallet_enable';
  params: unknown[];
}

export interface GetSnapsRequest {
  method: 'wallet_getSnaps';
}

export interface SnapRpcMethodRequest {
  method: string;
  params: [MetaMaskSSISnapRPCRequest];
}

export type MetamaskRpcRequest =
  | WalletEnableRequest
  | GetSnapsRequest
  | SnapRpcMethodRequest;
