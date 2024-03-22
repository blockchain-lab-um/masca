import type { W3CCredential } from '@0xpolygonid/js-sdk';
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
import type { SignJWTParams, SignJWZParams } from './signData.js';

/**
 * Types
 */
export interface ProofOptions {
  type?: string;
  domain?: string;
  challenge?: string;
}

export interface QueryCredentialsOptions {
  store?: AvailableCredentialStores | AvailableCredentialStores[];
  returnStore?: boolean;
}

export interface SaveCredentialOptions {
  store?: AvailableCredentialStores | AvailableCredentialStores[];
}

export interface DeleteCredentialsOptions {
  store?: AvailableCredentialStores | AvailableCredentialStores[];
}

// TODO (martin): This type is also in datamanager
export interface Filter {
  type: 'none' | 'id' | 'JSONPath';
  filter: string;
}

/**
 * Types for method arguments
 */

export interface CredentialRequest {
  id: string;
  metadata?: {
    store?: AvailableCredentialStores;
  };
}

export interface SetCurrentAccountRequestParams {
  account: string;
}

export interface CreatePresentationRequestParams {
  /*
   * @minItems 1
   */
  vcs: W3CVerifiableCredential[];
  proofFormat?: SupportedProofFormats;
  proofOptions?: ProofOptions;
}

export type MinimalUnsignedCredential = Pick<
  UnsignedCredential,
  | 'credentialSubject'
  | 'type'
  | '@context'
  | 'expirationDate'
  | 'credentialStatus'
  | 'id'
> &
  Record<string, any>;

export interface CreateCredentialRequestParams {
  minimalUnsignedCredential: MinimalUnsignedCredential;
  proofFormat?: SupportedProofFormats;
  options?: {
    save?: boolean;
    store?: AvailableCredentialStores | AvailableCredentialStores[];
  };
}

export interface QueryCredentialsRequestParams {
  filter?: Filter;
  options?: QueryCredentialsOptions;
}

export interface SaveCredentialRequestParams {
  verifiableCredential: W3CVerifiableCredential | W3CCredential;
  options?: SaveCredentialOptions;
}

export interface DeleteCredentialsRequestParams {
  id: string;
  options?: DeleteCredentialsOptions;
}

export interface ResolveDIDRequestParams {
  did: string;
}

export interface SwitchMethodRequestParams {
  didMethod: AvailableMethods;
}

export interface SetCredentialStoreRequestParams {
  store: AvailableCredentialStores;
  value: boolean;
}

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
export interface HandleCredentialOfferRequestParams {
  credentialOffer: string;
}

/**
 * HandleAuthorizationRequestParams
 */
export interface HandleAuthorizationRequestParams {
  authorizationRequest: string;
}

export interface SetCeramicSessionRequestParams {
  serializedSession: string;
}

export interface ImportStateBackupRequestParams {
  serializedState: string;
}

export interface AddTrustedDappRequestParams {
  origin: string;
}

export interface RemoveTrustedDappRequestParams {
  origin: string;
}

export interface AddDappSettingsRequestParams {
  origin: string;
}

export interface RemoveDappSettingsRequestParams {
  origin: string;
}

export interface ChangePermissionsRequestParams {
  origin: string;
  method: 'queryCredentials';
  value: boolean;
}

export type SignDataRequestParams = {
  type: 'JWT' | 'JWZ';
} & (SignJWTParams | SignJWZParams);
