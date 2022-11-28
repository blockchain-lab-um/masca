import { W3CVerifiableCredential } from '@veramo/core';
import {
    AvailableMethods,
    AvailableVCStores,
    SupportedProofFormats
} from './constants';

export type CreateVPRequestParams = {
    vcs: [
      {
        id: string;
        metadata?: {
          store?: AvailableVCStores;
        };
      }
    ];
    proofFormat?: SupportedProofFormats;
    proofOptions?: {
      type?: string;
      domain?: string;
      challenge?: string;
    };
  };
  
  export type QueryRequestParams = {
    filter?: {
      type: string;
      filter: any;
    };
    options?: {
      store?: AvailableVCStores | [AvailableVCStores];
      returnStore?: boolean;
    };
  };
  
  export type SaveVCRequestParams = {
    verifiableCredential: W3CVerifiableCredential;
    options?: {
      store?: AvailableVCStores | [AvailableVCStores];
    };
  };
  
  export type DeleteVCRequestParams = {
    id: string | [string];
    options?: {
      store?: AvailableVCStores | [AvailableVCStores];
    };
  };
  
  export type ChangeInfuraTokenRequestParams = {
    infuraToken: string;
  };
  
  export type SwitchMethodRequestParams = {
    didMethod: AvailableMethods;
  };
  
  export type SetVCStoreRequestParams = {
    store: AvailableVCStores;
    value: boolean;
  };