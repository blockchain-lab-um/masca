import {
  OAuth2AuthorizationServerMetadata,
  TokenRequestOAuth2,
  TokenResponseOAuth2,
} from './oauth2';

const SupportedCredentialFormats = [
  'jwt_vc_json',
  'jwt_vc_json-ld',
  'ldp_vc',
] as const;

/**
 * Server Metadata
 *
 * Specs: https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-11.2
 */
export interface ServerMetadata extends OAuth2AuthorizationServerMetadata {
  credential_endpoint: string;
  batch_credential_endpoints?: string[];
  credentials_supported: SupportedCredentials[];
}

/**
 * Supported Credentials
 *
 * Specs: https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-11.2.1
 */
interface SupportedCredentials {
  // https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-e.1
  format: typeof SupportedCredentialFormats[number];
  id?: string;
  // TODO: Define specific types
  // https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-8.1
  cryptographic_binding_methods_supported?: string[];
  // TODO: Define specific types
  cryptographic_suites_supported?: string[];
  display?: CredentialDisplay[];
  // TODO: https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-e.1.1.2
  // Check differences for JSON-LD
  types: string[];
  credentialSubject?: CredentialSubject;
  order?: string[];
}

/**
 * Credential Display
 *
 * Specs: #TODO
 */
interface CredentialDisplay {
  name: string;
  locale?: string;
  logo?: Logo;
  background_color?: string;
  text_color?: string;
}

/**
 * Logo
 *
 * Specs: #TODO
 */
interface Logo {
  url?: string;
  alternative_text?: string;
  description?: string;
}

/**
 * Credential Subject
 *
 * #FIXME: Check if this is correct
 * Specs: https://www.w3.org/TR/vc-data-model/#credential-subject
 * Specs: https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-11.2.1
 */
interface CredentialSubject {
  [key: string]: CredentialSubjectProperty;
}

interface CredentialSubjectPropertyDisplay {
  name?: string;
  locale?: string;
}

interface CredentialSubjectProperty {
  display?: CredentialSubjectPropertyDisplay[];
}

// https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-appendix.e
// FIXME: Needs to be implemented correctly
interface Credential {
  format: typeof SupportedCredentialFormats[number];
  types: string[];
}

export type Credentials = (string | Credential)[];

export interface IssuanceRequestParams {
  issuer: string;
  credentials: Credentials;
  'pre-authorized_code'?: string;
  user_pin_required?: boolean;
  op_state?: string;
}

/**
 *
 * SPECS: https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-7.1
 */
export interface TokenRequest extends Omit<TokenRequestOAuth2, 'grant_type'> {
  grant_type:
    | 'authorization_code'
    | 'urn:ietf:params:oauth:grant-type:pre-authorized_code';
  'pre-authorized_code'?: string;
  user_pin?: string;

  // FIXME: Probably not needed, because its only mentioned once and it is only in the example
  // https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-7.1-5
  code_verifier?: string;
}

/**
 * Token Response
 *
 * SPECS: https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#name-successful-token-response
 */
export interface TokenResponse extends TokenResponseOAuth2 {
  c_nonce?: string;
  c_nonce_expires_in?: number;
  authorization_pending?: boolean;
  interval?: number;
}

/**
 * Credential Request
 *
 * SPECS: https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#name-credential-request
 */
export interface CredentialRequest {
  format: typeof SupportedCredentialFormats[number]; // TODO: https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-appendix.e
  types: string[];
  proof?: {
    proof_type: 'jwt';
    jwt: string;
  };
}

/**
 * Credential Response
 *
 * SPECS: https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#name-credential-response
 */
export type CredentialResponse = {
  format: typeof SupportedCredentialFormats[number];
  credential?: string; // TODO: Can also be a JSON object, depending on the Credential format
  acceptance_token?: string;
  c_nonce?: string;
  c_nonce_expires_in?: number;
};
