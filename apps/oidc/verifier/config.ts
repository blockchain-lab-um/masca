import { PresentationDefinition } from '@blockchain-lab-um/oidc-types';

/**
 * This file is used to store environment variables that are used in the app.
 *
 * Needs to include:
 * - Supported DID methods
 * - Supported curves
 * - Supported digital signatures
 * - Supported schema URLs
 * - Verifier URL
 * - Presentation definitions
 */

export const SUPPORTED_DID_METHODS = ['did:ethr', 'did:key'];
export const SUPPORTED_CURVES = ['secp256k1', 'P-256', 'P-384', 'P-521'];
export const SUPPORTED_DIGITAL_SIGNATURES = ['ES256K'];
export const SUPPORTED_SCHEMA_URL =
  'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json';
export const VERIFIER_URL = 'http://localhost:3000';
export const PRESENTATION_DEFINITIONS: PresentationDefinition[] = [];
