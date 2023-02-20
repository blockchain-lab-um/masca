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
  credentials_supported: SupportedCredentials[];
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
 * Supported Credentials
 *
 * Specs:
 * - https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-10.2.3.1
 *
 * crypto_binding_methods_supported: ['cose_key', 'jwk', 'did', 'did:{method}']
 */
interface SupportedCredentials {
  // https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-e.1
  format: SupportedCredentialFormats;
  schema: string;
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
  alternative_text?: string;
  description?: string;
}

/**
 * Credential Subject
 *
 * #FIXME: Check if this is correct
 * SPECS:
 * - https://www.w3.org/TR/vc-data-model/#credential-subject
 * - https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-11.2.1
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
