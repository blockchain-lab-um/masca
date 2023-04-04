import {
  SupportedCredentialFormats,
  SupportedPresentationFormats,
} from './credential';
import {
  OAuth2AuthorizationServerMetadata,
  OAuth2ClientMetadata,
} from './oauth2';

/**
 * Issuer Server Metadata
 *
 * SPECS:
 * - https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-10.2.3
 */
export interface IssuerServerMetadata
  extends OAuth2AuthorizationServerMetadata {
  credential_issuer: string;
  credential_endpoint: string;
  authorization_server?: string; // https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-10.2.3
  batch_credential_endpoints?: string[];
  credentials_supported: SupportedCredential[];
  // TODO: DISPLAY (https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-10.2.3-4.2.1)
}

/**
 * Verifier Server Metadata
 *
 * SPECS:
 * - https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#section-9
 * - https://openid.bitbucket.io/connect/openid-connect-self-issued-v2-1_0.html#section-7.5
 *
 * EXTRAS:
 * - https://openid.net/specs/openid-connect-registration-1_0.html#ClientMetadata
 */
export interface VerifierServerMetadata extends OAuth2ClientMetadata {
  vp_formats: (SupportedCredentialFormats | SupportedPresentationFormats)[];
  subject_syntax_types_supported: string[];
}

/**
 * Supported Credential
 *
 * Specs:
 * - https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-10.2.3.1
 *
 * crypto_binding_methods_supported: ['cose_key', 'jwk', 'did', 'did:{method}']
 */
export type SupportedCredential =
  | {
      id?: string;
      cryptographic_binding_methods_supported?: string[];
      cryptographic_suites_supported?: string[];
      display?: CredentialDisplay[];
      order?: string[];
      credentialSchema: CredentialSchema; // Not in specs
    } & (
      | SupportedCredential_JWT_VC_JSON
      | SupportedCredential_JWT_VC_JSON_LD
      | SupportedCredential_MSO_MDOC
    );

export type SupportedCredential_JWT_VC_JSON = {
  format: 'jwt_vc_json';
  types: string[];
  credentialSubject?: any;
};

export type SupportedCredential_JWT_VC_JSON_LD = {
  format: 'jwt_vc_json-ld' | 'ldp_vc';
  types: string[];
  '@context': string[];
  credentialSubject?: any;
};

export type SupportedCredential_MSO_MDOC = {
  format: 'mso_mdoc';
  doctype: string;
  claims?: any;
};

export type CredentialSchema = {
  id: string;
  type: string;
};

/**
 * Credential Display
 *
 * SPECS:
 * - #TODO
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
 * SPECS:
 * - #TODO
 */
interface Logo {
  url?: string;
  alt_text?: string;
}
