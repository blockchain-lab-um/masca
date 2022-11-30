import { W3CVerifiableCredential } from '@veramo/core';
import {
  AvailableMethods,
  AvailableVCStores,
  isAvailableMethods,
  isAvailableVCStores,
  isSupportedProofFormat,
  SupportedProofFormats,
} from '../constants';

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

type QueryFilter = { type: string; filter: unknown };

type QueryOptions = {
  store?: AvailableVCStores | [AvailableVCStores];
  returnStore?: boolean;
};

export type QueryRequestParams = {
  filter?: QueryFilter;
  options?: QueryOptions;
};

type SaveVCOptions = {
  store?: AvailableVCStores | [AvailableVCStores];
};

export type SaveVCRequestParams = {
  verifiableCredential: W3CVerifiableCredential;
  options?: SaveVCOptions;
};

type DeleteVCRequestParams = {
  id: string | [string];
  options?: {
    store?: AvailableVCStores | [AvailableVCStores];
  };
};

export type ChangeInfuraTokenRequestParams = {
  infuraToken: string;
};

type GetVCsRequestParams = { query?: VCQuery };

export function isValidGetVCsRequest(
  params: unknown
): asserts params is GetVCsRequestParams {
  if (params != null && typeof params === 'object' && 'query' in params) return;

  throw new Error('Invalid GetVCs request');
}

type SaveVCRequestParams = { verifiableCredential: VerifiableCredential };

export function isValidSaveVCRequest(
  params: unknown
): asserts params is SaveVCRequestParams {
  if (
    params != null &&
    typeof params === 'object' &&
    'verifiableCredential' in params
  )
    return;

  throw new Error('Invalid SaveVC request');
}

type GetVPRequestParams = {
  vcId: string;
  domain?: string;
  challenge?: string;
};

export function isValidGetVPRequest(
  params: unknown
): asserts params is GetVPRequestParams {
  if (
    params != null &&
    typeof params === 'object' &&
    'vcId' in params &&
    (params as GetVPRequestParams).vcId != null &&
    typeof (params as GetVPRequestParams).vcId === 'string'
  )
    return;

  throw new Error('Invalid GetVP request');
}

type ChangeInfuraTokenRequestParams = {
  infuraToken: string;
};

export function isValidChangeInfuraTokenRequest(
  params: unknown
): asserts params is ChangeInfuraTokenRequestParams {
  if (
    params != null &&
    typeof params === 'object' &&
    'infuraToken' in params &&
    (params as ChangeInfuraTokenRequestParams).infuraToken != null &&
    typeof (params as ChangeInfuraTokenRequestParams).infuraToken === 'string'
  )
    return;

  throw new Error('Invalid ChangeInfuraToken request');
}

type SwitchMethodRequestParams = {
  didMethod: string;
};

export function isValidSwitchMethodRequest(
  params: unknown
): asserts params is SwitchMethodRequestParams {
  if (
    params != null &&
    typeof params === 'object' &&
    'didMethod' in params &&
    (params as SwitchMethodRequestParams).didMethod != null &&
    typeof (params as SwitchMethodRequestParams).didMethod === 'string'
  )
    return;

  throw new Error('Invalid switchMethod request.');
}
