import { W3CVerifiableCredential } from '@veramo/core';
import {
  AvailableMethods,
  AvailableVCStores,
  SupportedProofFormats,
} from './constants';

/**
 * Types
 */
export type ProofOptions = {
  type?: string;
  domain?: string;
  challenge?: string;
};

export type QueryVCsOptions = {
  store?: AvailableVCStores | AvailableVCStores[];
  returnStore?: boolean;
};

export type SaveVCOptions = {
  store?: AvailableVCStores | AvailableVCStores[];
};

export type DeleteVCsOptions = {
  store?: AvailableVCStores | AvailableVCStores[];
};

//TODO: This type is also in vcmanager
export type Filter = {
  type: string;
  filter: unknown;
};

/**
 * Types for method arguments
 */

export type VCRequest = {
  id: string;
  metadata?: {
    store?: AvailableVCStores;
  };
};
export type CreateVPRequestParams = {
  vcs: VCRequest[];
  proofFormat?: SupportedProofFormats;
  proofOptions?: ProofOptions;
};

export type QueryVCsRequestParams = {
  filter?: Filter;
  options?: QueryVCsOptions;
};

export type SaveVCRequestParams = {
  verifiableCredential: W3CVerifiableCredential;
  options?: SaveVCOptions;
};

export type DeleteVCsRequestParams = {
  id: string;
  options?: DeleteVCsOptions;
};

export type ChangeInfuraTokenRequestParams = {
  infuraToken: string;
};

export type ResolveDIDRequestParams = {
  did: string;
};

export type SwitchMethodRequestParams = {
  didMethod: AvailableMethods;
};

export type SetVCStoreRequestParams = {
  store: AvailableVCStores;
  value: boolean;
};
