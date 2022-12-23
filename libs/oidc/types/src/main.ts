import {
  AuthorizationRequestOAuth2,
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
export interface CredentialResponse {
  format: typeof SupportedCredentialFormats[number];
  credential?: string; // TODO: Can also be a JSON object, depending on the Credential format
  acceptance_token?: string;
  c_nonce?: string;
  c_nonce_expires_in?: number;
}

/**
 * VERIFIER
 */

type FormatKeys = 'jwt' | 'jwt_vc' | 'jwt_vp' | 'ldp' | 'ldp_vc' | 'ldp_vp';
type Algorithm = 'ES256K' | 'EdDSA';

type Format = Partial<Record<FormatKeys, { alg: Algorithm[] }>>;

/**
 * Authentication Request
 *
 * SPECS:
 * - https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#name-request
 * - https://openid.net/specs/openid-connect-self-issued-v2-1_0.html#section-10
 *
 * EXTRAS:
 * - https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#section-a.5
 * - https://www.rfc-editor.org/rfc/rfc6749.html#section-4.1.1
 * - https://openid.net/specs/oauth-v2-multiple-response-types-1_0.html#ResponseTypesAndModes
 */
export interface AuthorizationRequest
  extends Omit<AuthorizationRequestOAuth2, 'response_type' | 'redirect_uri'> {
  response_type: 'id_token' | 'vp_token' | 'code';
  nonce: string;
  // OpenID4VP
  presentation_definition?: PresentationDefinition;
  presentation_definition_uri?: string;
  // SIOP
  claims?: any;
  redirect_uri: string;
  response_mode?: 'post' | 'fragment' | 'query';
  id_token_hint?: string;
  clinet_metadata?: any; // FIXME: Define later
  client_metadata_uri?: string;
  request?: any; // FXIME: Define later
  request_uri?: string;
  id_token_type?: string;
}

interface Field {
  path: string[];
  id?: string;
  purpose?: string;
  name?: string;
  filter?: any;
}

// one or both of these are required
interface Constraints {
  limit_disclosure?: 'required' | 'preferred';
  fields?: Field[];
}

interface InputDescriptor {
  id: string;
  name?: string;
  purpose?: string;
  format?: Format;
  constraints: Constraints;
}

/**
 * Presentation Definition
 *
 * SPECS: https://identity.foundation/presentation-exchange/#presentation-definition
 */
export interface PresentationDefinition {
  id: string;
  format?: Format;
  input_descriptors: InputDescriptor[];
}

/**
 * Authorization Response
 *
 * SPECS: https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#section-6
 */
export interface AuthorizationResponse {
  presentation_submission?: PresentationSubmission;
  vp_token?: string;
  id_token?: string;
}

/**
 * Presentation Submission
 *
 * SPECS: https://identity.foundation/presentation-exchange/#presentation-submission
 */
export interface PresentationSubmission {
  id: string;
  definition_id: string;
  descriptor_map: DescriptorMap[];
}

interface DescriptorMap {
  id: string;
  format: Format;
  path: string;
  path_nested?: string;
}
