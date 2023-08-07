export interface ErrorObject {
  error: string;
  error_description: string;
}

/**
 * Authorization Error Response
 *
 * Error codes defined in RFC6749
 * https://tools.ietf.org/html/rfc6749#section-4.1.2.1
 *
 * Additional clarification in OpenID-4-VC-Issuance-1_0
 * https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#name-authorization-error-respons
 */
const AUTHORIZATION_ERROR_CODES = [
  'invalid_request',
  'unauthorized_client',
  'access_denied',
  'unsupported_response_type',
  'invalid_scope',
  'server_error',
  'temporarily_unavailable',
] as const;

export const AUTHORIZATION_ERRORS: Record<
  (typeof AUTHORIZATION_ERROR_CODES)[number],
  string
> = {
  invalid_request:
    'The request is missing a required parameter, includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed.',
  unauthorized_client:
    'The client is not authorized to request an authorization code using this method.',
  access_denied:
    'The resource owner or authorization server denied the request.',
  unsupported_response_type:
    'The authorization server does not support obtaining an authorization code using this method.',
  invalid_scope: 'The requested scope is invalid, unknown, or malformed.',
  server_error:
    'The authorization server encountered an unexpected condition that prevented it from fulfilling the request.',
  temporarily_unavailable:
    'The authorization server is currently unable to handle the request due to a temporary overloading or maintenance of the server.',
};

/**
 * Token Error Response
 *
 * Error codes defined in RFC6749
 * https://tools.ietf.org/html/rfc6749#section-5.2
 *
 * Additional clarification in OpenID-4-VC-Issuance-1_0
 * https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#name-token-error-response
 */
const TOKEN_ERROR_CODES = [
  'invalid_request',
  'invalid_client',
  'invalid_grant',
  'unauthorized_client',
  'unsupported_grant_type',
  'invalid_scope',
] as const;

export const TOKEN_ERRORS: Record<(typeof TOKEN_ERROR_CODES)[number], string> =
  {
    invalid_request:
      'The request is missing a required parameter, includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed.',
    invalid_client:
      'Client authentication failed (e.g., unknown client, no client authentication included, or unsupported authentication method).',
    invalid_grant:
      'The provided authorization grant (e.g., authorization code, resource owner credentials) or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client.',
    unauthorized_client:
      'The authenticated client is not authorized to use this authorization grant type.',
    unsupported_grant_type:
      'The authorization grant type is not supported by the authorization server.',
    invalid_scope:
      'The requested scope is invalid, unknown, malformed, or exceeds the scope granted by the resource owner.',
  };

/**
 * Credential Error Response
 *
 * Error codes defined in RFC6750
 * https://tools.ietf.org/html/rfc6750#section-3.1
 *
 * Additional clarification in OpenID-4-VC-Issuance-1_0
 * https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#name-credential-error-response
 */
const CREDENTIAL_ERROR_CODES = [
  'invalid_request',
  'invalid_token',
  'insufficient_scope',
  'unsupported_credential_type',
  'unsupported_credential_format',
  'invalid_or_missing_proof',
] as const;

export const CREDENTIAL_ERRORS: Record<
  (typeof CREDENTIAL_ERROR_CODES)[number],
  string
> = {
  invalid_request:
    'The request is missing a required parameter (i.e. format, proof), includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed.',
  invalid_token:
    'The access token provided is expired, revoked, malformed, or invalid for other reasons.',
  insufficient_scope:
    'The request requires higher privileges than provided by the access token.',
  unsupported_credential_type: 'The credential type is not supported.',
  unsupported_credential_format: 'The credential format is not supported.',
  invalid_or_missing_proof:
    'Credential Request did not contain a proof, or proof was invalid, i.e. it was not bound to a Credential Issuer provided nonce.',
};
