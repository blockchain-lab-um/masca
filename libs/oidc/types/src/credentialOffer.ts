// https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-appendix.e

import type { SupportedCredentialFormats } from './credential.js';

export type Credential = {
  format: SupportedCredentialFormats;
} & (
  | {
      format: 'jwt_vc_json' | 'jwt_vc_json-ld' | 'ldp_vc' | 'sd-jwt';
      types: string[];
    }
  | {
      format: 'mso_mdoc';
      doctype: string;
    }
);

export type Credentials = (string | Credential)[];

export interface Grants {
  authorization_code?: {
    issuer_state?: string;
  };
  'urn:ietf:params:oauth:grant-type:pre-authorized_code'?: {
    'pre-authorized_code': string;
    user_pin_required?: boolean;
  };
}

export interface CredentialOfferRequest {
  credentials: Credentials;
  grants?: (
    | 'urn:ietf:params:oauth:grant-type:pre-authorized_code'
    | 'authorization_code'
  )[];
  userPinRequired?: boolean;
}

export interface CredentialOffer {
  credential_issuer: string;
  credentials: Credentials;
  grants?: Grants;
}
