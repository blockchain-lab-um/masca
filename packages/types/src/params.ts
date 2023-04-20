import {
  UnsignedCredential,
  W3CVerifiableCredential,
  W3CVerifiablePresentation,
} from '@veramo/core';

import {
  AvailableMethods,
  AvailableVCStores,
  SupportedProofFormats,
} from './constants.js';

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

// TODO (martin): This type is also in vcmanager
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

export type SetCurrentAccountRequestParams = {
  currentAccount: string;
};

export type CreateVPRequestParams = {
  vcs: VCRequest[];
  proofFormat?: SupportedProofFormats;
  proofOptions?: ProofOptions;
};

export type MinimalUnisignedCredential = Pick<
  UnsignedCredential,
  | 'credentialSubject'
  | 'type'
  | '@context'
  | 'expirationDate'
  | 'credentialStatus'
  | 'id'
> & { [x: string]: any };

export type CreateVCRequestParams = {
  minimalUnsignedCredential: MinimalUnisignedCredential;
  proofFormat?: SupportedProofFormats;
  options?: {
    save?: boolean;
    store?: AvailableVCStores | AvailableVCStores[];
  };
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

/**
 * VerifyDataRequestParams
 * @description
 * This type is used to verify a verifiable credential or presentation.
 * If a verifiable credential is provided, the presentation parameter should be undefined.
 * If a verifiable presentation is provided, the credential parameter should be undefined.
 * @param {W3CVerifiableCredential} verifiableCredential - The verifiable credential to verify
 * @param {W3CVerifiablePresentation} verifiablePresentation - The verifiable presentation to verify
 * @param {boolean} verbose - Whether to return the full verification result or just a boolean (default: false)
 */
export type VerifyDataRequestParams =
  | {
      credential: W3CVerifiableCredential;
      presentation?: undefined;
      verbose?: boolean;
    }
  | {
      credential?: undefined;
      presentation: W3CVerifiablePresentation;
      verbose?: boolean;
    };
