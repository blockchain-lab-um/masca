import { SupportedCredential } from '@blockchain-lab-um/oidc-types';

/**
 * This file is used to store environment variables that are used in the app.
 *
 * Needs to include:
 * - Supported DID methods
 * - Supported curves
 * - Supported digital signatures
 * - Supported schema URLs
 * - Issuer URL
 * - Supported credentials
 * - Presentation definitions
 */

export const SUPPORTED_DID_METHODS = ['did:ethr', 'did:key'];
export const SUPPORTED_CURVES = ['secp256k1', 'P-256', 'P-384', 'P-521'];
export const SUPPORTED_DIGITAL_SIGNATURES = ['ES256K'];
export const SUPPORTED_SCHEMA_URL =
  'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json';
export const ISSUER_URL = 'http://localhost:3000';

export const SUPPORTED_CREDENTIALS: SupportedCredential[] = [
  {
    schema:
      'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
    ],
    types: ['VerifiableCredential', 'ProgramCompletionCertificate'],
    format: 'jwt_vc_json',
    cryptographic_binding_methods_supported: ['did'],
    cryptographic_suites_supported: ['ES256K'],
  },
];
