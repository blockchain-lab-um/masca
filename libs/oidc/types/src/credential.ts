export const supportedCredentialFormats = [
  'jwt_vc_json',
  'jwt_vc_json-ld',
  'ldp_vc',
] as const;

export type SupportedCredentialFormats =
  (typeof supportedCredentialFormats)[number];

/**
 * Credential Request
 *
 * We use schema instead of types
 *
 * SPECS: https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#name-credential-request
 */
export type CredentialRequest = {
  format: SupportedCredentialFormats;
  types?: string[];
  schema?: string;
  proof?: Proof;
};

export type JWTProof = {
  proof_type: 'jwt';
  jwt: string;
};

export type Proof = JWTProof;

/**
 * Credential Response
 *
 * SPECS: https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#name-credential-response
 */
export interface CredentialResponse {
  format: SupportedCredentialFormats;
  credential?: string; // TODO: Can also be a JSON object, depending on the Credential format
  acceptance_token?: string;
  c_nonce?: string;
  c_nonce_expires_in?: number;
}

export type SupportedCredential = {
  '@context': string[];
  schema: string;
  format: SupportedCredentialFormats;
  types: string[];
  cryptographic_binding_methods_supported?: string[];
  cryptographic_suites_supported?: string[];
};
