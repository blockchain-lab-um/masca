import { W3CVerifiablePresentation } from '@veramo/core';

import {
  AuthorizationRequestOAuth2,
  AuthorizationResponseOAuth2,
} from './oauth2.js';

/**
 * Authorization Request
 *
 * SPECS:
 * - https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#name-request
 * - https://openid.net/specs/openid-connect-self-issued-v2-1_0.html#section-9
 *
 * EXTRAS:
 * - https://openid.net/specs/openid-connect-core-1_0.html#Authentication
 * - https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#section-a.5
 * - https://www.rfc-editor.org/rfc/rfc6749.html#section-4.1.1
 * - https://openid.net/specs/oauth-v2-multiple-response-types-1_0.html#ResponseTypesAndModes
 */
export interface AuthorizationRequest
  extends Omit<AuthorizationRequestOAuth2, 'response_type' | 'redirect_uri'> {
  response_type: 'id_token' | 'vp_token' | 'code' | 'vp_token id_token';
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

type Field = {
  path: string[];
  id?: string;
  purpose?: string;
  name?: string;
  filter?: any;
};

// One or both of these are required
type Constraints = {
  limit_disclosure?: 'required' | 'preferred';
  fields?: Field[];
};

type InputDescriptor = {
  id: string;
  name?: string;
  purpose?: string;
  format?: Format;
  constraints: Constraints;
};

/**
 * Presentation Definition
 *
 * SPECS:
 * - https://identity.foundation/presentation-exchange/#presentation-definition
 */
export type PresentationDefinition = {
  id: string;
  format?: Format;
  input_descriptors: InputDescriptor[];
};

/**
 * Presentation Submission
 *
 * SPECS:
 * - https://identity.foundation/presentation-exchange/#presentation-submission
 */
export type PresentationSubmission = {
  id: string;
  definition_id: string;
  descriptor_map: DescriptorMap[];
};

type DescriptorMap = {
  id: string;
  format: string;
  path: string;
  path_nested?: DescriptorMap;
};
