import { VerifiableCredential } from '@veramo/core';

export interface VCQuery {
  [key: string]: string;
}

export interface QueryVCs {
  method: 'queryVCs';
  params: {
    query?: VCQuery;
  };
}

export interface SaveVC {
  method: 'saveVC';
  params: {
    verifiableCredential: VerifiableCredential;
  };
}

export interface CreateVP {
  method: 'createVP';
  params: {
    vcId: string;
    domain?: string;
    challenge?: string;
  };
}

export interface ChangeInfuraToken {
  method: 'changeInfuraToken';
  params: {
    infuraToken: string;
  };
}

export interface TogglePopups {
  method: 'togglePopups';
}

export interface GetDID {
  method: 'getDID';
}

export interface GetMethod {
  method: 'getMethod';
}

export interface GetAvailableMethods {
  method: 'getAvailableMethods';
}

export interface SwitchMethod {
  method: 'switchMethod';
  params: {
    didMethod: string;
  };
}

export interface GetVCStore {
  method: 'getVCStore';
}

export interface SetVCStore {
  method: 'setVCStore';
  params: {
    vcStore: string;
  };
}

export interface GetAvailableVCStores {
  method: 'getAvailableVCStores';
}