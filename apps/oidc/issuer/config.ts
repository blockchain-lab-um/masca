import { SupportedCredential } from '@blockchain-lab-um/oidc-types';

/**
 * This file is used to store environment variables that are used in the app.
 *
 * Needs to include:
 * - Supported DID methods
 * - Supported curves
 * - Supported digital signatures
 * - Issuer URL
 * - Supported credentials
 */

export const SUPPORTED_DID_METHODS = ['did:ethr', 'did:key'];
export const SUPPORTED_CURVES = ['secp256k1', 'P-256', 'P-384', 'P-521'];
export const SUPPORTED_DIGITAL_SIGNATURES = ['ES256K'];

export const ISSUER_URL = 'http://127.0.0.1:3003';

export const SUPPORTED_CREDENTIALS: SupportedCredential[] = [
  {
    id: 'GmCredential',
    credentialSchema: {
      id: 'https://raw.githubusercontent.com/discoxyz/disco-schemas/main/json/GMCredential/1-0-0.json',
      type: 'JsonSchemaValidator2018',
    },
    format: 'jwt_vc_json',
    types: ['VerifiableCredential', 'GmCredential'],
    cryptographic_binding_methods_supported: ['did'],
    cryptographic_suites_supported: ['ES256K'],
  },
  {
    credentialSchema: {
      id: 'https://raw.githubusercontent.com/discoxyz/disco-schemas/main/json/GMCredential/1-0-0.json',
      type: 'JsonSchemaValidator2018',
    },
    format: 'jwt_vc_json-ld',
    types: ['VerifiableCredential', 'GmCredential'],
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    cryptographic_binding_methods_supported: ['did'],
    cryptographic_suites_supported: ['ES256K'],
  },
  {
    credentialSchema: {
      id: 'https://raw.githubusercontent.com/discoxyz/disco-schemas/main/json/GMCredential/1-0-0.json',
      type: 'JsonSchemaValidator2018',
    },
    format: 'ldp_vc',
    types: ['VerifiableCredential', 'GmCredential'],
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    cryptographic_binding_methods_supported: ['did'],
    cryptographic_suites_supported: ['ES256K'],
  },
  // This is only used to for tests
  {
    credentialSchema: {
      id: 'https://raw.githubusercontent.com/discoxyz/disco-schemas/main/json/GMCredential/1-0-0.json',
      type: 'JsonSchemaValidator2018',
    },
    format: 'mso_mdoc',
    doctype: 'org.iso.18013.5.1.mDL',
    cryptographic_binding_methods_supported: ['did'],
    cryptographic_suites_supported: ['ES256K'],
  },
];
