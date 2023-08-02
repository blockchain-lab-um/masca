import { W3CCredential } from '@0xpolygonid/js-sdk';
import type {
  UnsignedCredential,
  W3CVerifiableCredential,
  W3CVerifiablePresentation,
} from '@veramo/core';

import type {
  AvailableCredentialStores,
  AvailableMethods,
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

export type QueryCredentialsOptions = {
  store?: AvailableCredentialStores | AvailableCredentialStores[];
  returnStore?: boolean;
};

export type SaveCredentialOptions = {
  store?: AvailableCredentialStores | AvailableCredentialStores[];
};

export type DeleteCredentialsOptions = {
  store?: AvailableCredentialStores | AvailableCredentialStores[];
};

// TODO (martin): This type is also in datamanager
export type Filter = {
  type: 'none' | 'id' | 'JSONPath';
  filter: string;
};

/**
 * Types for method arguments
 */

export type CredentialRequest = {
  id: string;
  metadata?: {
    store?: AvailableCredentialStores;
  };
};

export type SetCurrentAccountRequestParams = {
  currentAccount: string;
};

export type CreatePresentationRequestParams = {
  /*
   * @minItems 1
   */
  vcs: W3CVerifiableCredential[];
  proofFormat?: SupportedProofFormats;
  proofOptions?: ProofOptions;
};

export type MinimalUnsignedCredential = Pick<
  UnsignedCredential,
  | 'credentialSubject'
  | 'type'
  | '@context'
  | 'expirationDate'
  | 'credentialStatus'
  | 'id'
> & { [x: string]: any };

export type CreateCredentialRequestParams = {
  minimalUnsignedCredential: MinimalUnsignedCredential;
  proofFormat?: SupportedProofFormats;
  options?: {
    save?: boolean;
    store?: AvailableCredentialStores | AvailableCredentialStores[];
  };
};

export type QueryCredentialsRequestParams = {
  filter?: Filter;
  options?: QueryCredentialsOptions;
};

export type SaveCredentialRequestParams = {
  verifiableCredential: W3CVerifiableCredential | W3CCredential;
  options?: SaveCredentialOptions;
};

export type DeleteCredentialsRequestParams = {
  id: string;
  options?: DeleteCredentialsOptions;
};

export type ResolveDIDRequestParams = {
  did: string;
};

export type SwitchMethodRequestParams = {
  didMethod: AvailableMethods;
};

export type SetCredentialStoreRequestParams = {
  store: AvailableCredentialStores;
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

/**
 * HandleCredentialOfferRequestParams
 */
export type HandleCredentialOfferRequestParams = {
  credentialOffer: string;
};

/**
 * HandleAuthorizationRequestParams
 */
export type HandleAuthorizationRequestParams = {
  authorizationRequest: string;
};

export type SetCeramicSessionRequestParams = {
  serializedSession: string;
};

export type RemoveFriendlyDappParams = {
  id: string;
};
