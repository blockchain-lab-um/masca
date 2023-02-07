// https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-appendix.e

import { SupportedCredentialFormats } from './credential';

// TODO: Needs to be implemented correctly
export type Credential = {
  format: SupportedCredentialFormats;
  types: string[];
};

export type Credentials = (string | Credential)[];

export type Grants = {
  authorization_code?: {
    issuer_state?: string;
  };
  'urn:ietf:params:oauth:grant-type:pre-authorized_code'?: {
    'pre-authorized_code': string;
    user_pin_required?: boolean;
  };
};

export interface CredentialOfferRequest {
  schema: string;
  // TODO: Should grants be added here or are they hardcoded on the issuer side?
}

export interface CredentialOfferParams {
  credential_issuer: string;
  credentials: Credentials;
  grants?: Grants;
}
