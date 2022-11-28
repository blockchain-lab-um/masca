import {
    GetVCs,
    SaveVC,
    GetVP,
    ChangeInfuraToken,
    TogglePopups,
    GetDID,
    GetMethod,
    GetAvailableMethods,
    SwitchMethod,
    GetVCStore,
    SetVCStore,
    GetAvailableVCStores
} from './methods';

export type MetaMaskSSISnapRPCRequest =
  | GetVCs
  | SaveVC
  | GetVP
  | ChangeInfuraToken
  | TogglePopups
  | GetDID
  | GetMethod
  | GetAvailableMethods
  | SwitchMethod
  | GetVCStore
  | SetVCStore
  | GetAvailableVCStores;

export type Method = MetaMaskSSISnapRPCRequest['method'];

export interface WalletEnableRequest {
  method: 'wallet_enable';
  params: object[];
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