import type { W3CVerifiablePresentation } from '@veramo/core';

import type {
  AuthorizationRequestOAuth2,
  AuthorizationResponseOAuth2,
} from './oauth2.js';

/**
 * Authorization Request
 *
 * SPECS:
 * - https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#name-request
 * - https://openid.net/specs/openid-connect-self-issued-v2-1_0.html#section-9
 * - https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#name-authorization-endpoint
 * - https://datatracker.ietf.org/doc/html/rfc9101#name-authorization-request
 * - https://datatracker.ietf.org/doc/html/rfc7636
 *
 * EXTRAS:
 * - https://openid.net/specs/openid-connect-core-1_0.html#Authentication
 * - https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#section-a.5
 * - https://www.rfc-editor.org/rfc/rfc6749.html#section-4.1.1
 * - https://openid.net/specs/oauth-v2-multiple-response-types-1_0.html#ResponseTypesAndModes
 */
export interface AuthorizationRequest
  extends Omit<AuthorizationRequestOAuth2, 'response_type'> {
  response_type: 'id_token' | 'vp_token' | 'code' | 'vp_token id_token';

  // OpenID4VP
  nonce: string;
  presentation_definition?: PresentationDefinition;
  presentation_definition_uri?: string;

  // OpenID4VC
  authorization_details?: string;

  // SIOP
  client_metadata?: string;
  client_metadata_uri?: string;
  id_token_type?: string;

  // OpenID Connect Core
  response_mode?: 'post' | 'fragment' | 'query';
  display?: string;
  prompt?: string;
  max_age?: number;
  ui_locales?: string;
  id_token_hint?: string;
  acr_values?: string;
  claims?: string;
  request?: string; // JWT that holds the JSON encoded OAuth 2.0 Authorization Request parameters
  request_uri?: string;

  // PKCE (Proof Key for Code Exchange)
  code_challenge?: string;
  code_challenge_method?: string;
}

/**
 * Authorization Response
 *
 * SPECS:
 * - https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#section-6
 */
export type AuthorizationResponse = Omit<
  AuthorizationResponseOAuth2,
  'code'
> & {
  presentation_submission?: PresentationSubmission;
  vp_token?: W3CVerifiablePresentation | W3CVerifiablePresentation[];
  id_token?: string;
};

type FormatKeysJwt = 'jwt' | 'jwt_vc' | 'jwt_vp';
type FormatKeyLdp = 'ldp' | 'ldp_vc' | 'ldp_vp';
type JWTAlgorithm = 'ES256K' | 'EdDSA' | 'ES384';
type LDPAlgorithm =
  | 'JsonWebSignature2020'
  | 'Ed25519Signature2018'
  | 'EcdsaSecp256k1Signature2019'
  | 'RsaSignature2018';

type Format = Partial<
  | Record<FormatKeysJwt, { alg: JWTAlgorithm[] }>
  | Record<FormatKeyLdp, { proof_type: LDPAlgorithm[] }>
>;

interface Field {
  path: string[];
  id?: string;
  purpose?: string;
  name?: string;
  filter?: any;
}

// One or both of these are required
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
 * SPECS:
 * - https://identity.foundation/presentation-exchange/#presentation-definition
 */
export interface PresentationDefinition {
  id: string;
  format?: Format;
  input_descriptors: InputDescriptor[];
}

/**
 * Presentation Submission
 *
 * SPECS:
 * - https://identity.foundation/presentation-exchange/#presentation-submission
 */
export interface PresentationSubmission {
  id: string;
  definition_id: string;
  descriptor_map: DescriptorMap[];
}

interface DescriptorMap {
  id: string;
  format: string;
  path: string;
  path_nested?: DescriptorMap;
}
