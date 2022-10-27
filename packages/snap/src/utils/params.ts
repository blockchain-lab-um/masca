import { VCQuery } from '@blockchain-lab-um/ssi-snap-types';
import { VerifiableCredential } from '@veramo/core';

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
