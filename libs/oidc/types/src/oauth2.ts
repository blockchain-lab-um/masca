/* eslint-disable max-len */
/**
 * OAuth 2.0 Authorization Server Metadata
 *
 * SPECS:
 * - https://www.rfc-editor.org/rfc/rfc8414.html#section-2
 */
export interface OAuth2AuthorizationServerMetadata {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  jwks_uri?: string; // URL of the authorization server’s JWK Set [JWK] document.
  registration_endpoint?: string; // URL of the authorization server’s OAuth 2.0 Client Registration Endpoint [RFC7591].
  scopes_supported?: any[]; // JSON array containing a list of the OAuth 2.0 [RFC6749] scope values that this authorization server supports.
  response_types_supported: any[]; // JSON array containing a list of the OAuth 2.0 response_type values that this authorization server supports.
  response_modes_supported?: any[]; // JSON array containing a list of the OAuth 2.0 response_mode values that this authorization server supports.
  grant_types_supported?: any[]; // JSON array containing a list of the OAuth 2.0 grant_type values that this authorization server supports.
  token_endpoint_auth_methods_supported?: any[]; // JSON array containing a list of client authentication methods supported by this token endpoint.
  token_endpoint_auth_signing_alg_values_supported?: any[]; // JSON array containing a list of the JWS signing algorithms (alg values) supported by the token endpoint for the signature on the JWT used to authenticate the client at the token endpoint for the private_key_jwt and client_secret_jwt authentication methods.
  service_documentation?: string; // URL of a page containing human-readable information that developers might want or need to know when using the authorization server.
  ui_locales_supported?: any[]; // Languages and scripts supported for the user interface, represented as a JSON array of language tag values from BCP 47 [RFC5646].
  op_policy_uri?: string; // URL that the authorization server provides to the person registering the client to read about the authorization server’s requirements on how the client can use the data provided by the authorization server.
  op_tos_uri?: string; // URL that the authorization server provides to the person registering the client to read about authorization server’s terms of service.
  revocation_endpoint?: string; // URL of the authorization server’s OAuth 2.0 Token Revocation Endpoint [RFC7009].
  revocation_endpoint_auth_methods_supported?: any[]; // JSON array containing a list of client authentication methods supported by this revocation endpoint.
  revocation_endpoint_auth_signing_alg_values_supported?: any[]; // JSON array containing a list of the JWS signing algorithms (alg values) supported by the revocation endpoint for the signature on the JWT used to authenticate the client at the revocation endpoint for the private_key_jwt and client_secret_jwt authentication methods.
  introspection_endpoint?: string; // URL of the authorization server’s OAuth 2.0 Token Introspection Endpoint [RFC7662].
  introspection_endpoint_auth_methods_supported?: any[]; // JSON array containing a list of client authentication methods supported by this introspection endpoint.
  introspection_endpoint_auth_signing_alg_values_supported?: any[]; // JSON array containing a list of the JWS signing algorithms (alg values) supported by the introspection endpoint for the signature on the JWT used to authenticate the client at the introspection endpoint for the private_key_jwt and client_secret_jwt authentication methods.
  code_challenge_methods_supported?: any[]; // JSON array containing a list of Proof Key for Code Exchange (PKCE) [RFC7636] code challenge methods supported by this authorization server.
}

/**
 * OAuth 2.0 Client Metadata
 *
 * SPECS:
 * - https://www.rfc-editor.org/rfc/rfc7591.html#section-2
 */
export interface OAuth2ClientMetadata {
  redirect_uris?: string[];
  token_endpoint_auth_method?: (typeof TOKEN_ENDPOINT_AUTH_METHODS)[number];
  grant_types?: (typeof GRANT_TYPES)[number][];
  response_types?: ('code' | 'token')[];
  client_name?: string;
  client_uri?: string;
  logo_uri?: string;
  scope?: string;
  contacts?: string[];
  tos_uri?: string;
  policy_uri?: string;
  jwks_uri?: string;
  jwks?: any;
  software_id?: string;
  software_version?: string;
}

export const TOKEN_ENDPOINT_AUTH_METHODS = [
  'none',
  'client_secret_post',
  'client_secret_basic',
] as const;

export const GRANT_TYPES = [
  'authorization_code',
  'implicit',
  'password',
  'client_credentials',
  'urn:ietf:params:oauth:grant-type:jwt-bearer',
  'urn:ietf:params:oauth:grant-type:saml2-bearer',
] as const;

/**
 * OAuth 2.0 Token Request
 *
 * SPECS:
 * - https://www.rfc-editor.org/rfc/rfc6749.html#section-4.1.3
 */
export interface TokenRequestOAuth2 {
  grant_type: 'authorization_code';
  code?: string;
  redirect_uri?: string;
  client_id?: string;
}

/**
 * OAuth 2.0 Token Response
 *
 * SPECS:
 * - https://www.rfc-editor.org/rfc/rfc6749.html#section-5.1
 */
export interface TokenResponseOAuth2 {
  access_token: string;
  token_type: string;
  expires_in?: number; // Recommended
  refresh_token?: string;
  scope?: string;
}

/**
 * OAuth 2.0 Authorization Request
 *
 * SPECS:
 * - https://www.rfc-editor.org/rfc/rfc6749.html#section-4.1.1
 */
export interface AuthorizationRequestOAuth2 {
  response_type: 'code';
  client_id: string;
  redirect_uri?: string;
  scope?: string;
  state?: string; // Recommended
}

/**
 * OAuth 2.0 Authorization Response
 *
 * SPECS:
 * - https://www.rfc-editor.org/rfc/rfc6749.html#section-4.1.2
 */
export interface AuthorizationResponseOAuth2 {
  code: string;
  state?: string;
}
