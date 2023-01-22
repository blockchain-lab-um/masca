import { SupportedCredentialFormats } from './credential';
import { OAuth2AuthorizationServerMetadata } from './oauth2';

/**
 * Server Metadata
 *
 * Specs: https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-11.2
 */
export interface IssuerServerMetadata
  extends OAuth2AuthorizationServerMetadata {
  credential_endpoint: string;
  batch_credential_endpoints?: string[];
  credentials_supported: SupportedCredentials[];
}

/**
 * Supported Credentials
 *
 * Specs: https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-10.2.3.1
 *
 * crypto_binding_methods_supported: ['cose_key', 'jwk', 'did', 'did:{method}']
 */
interface SupportedCredentials {
  // https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-e.1
  format: SupportedCredentialFormats;
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
