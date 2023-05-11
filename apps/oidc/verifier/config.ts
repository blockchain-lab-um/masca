import { PresentationDefinition } from '@blockchain-lab-um/oidc-types';

/**
 * This file is used to store environment variables that are used in the app.
 *
 * Needs to include:
 * - Supported DID methods
 * - Supported curves
 * - Supported digital signatures
 * - Verifier URL
 * - Presentation definitions
 */

export const SUPPORTED_DID_METHODS = ['did:ethr', 'did:key'];
export const SUPPORTED_CURVES = ['secp256k1', 'P-256', 'P-384', 'P-521'];
export const SUPPORTED_DIGITAL_SIGNATURES = ['ES256K'];

export const VERIFIER_URL = 'http://127.0.0.1:3000';

export const PRESENTATION_DEFINITIONS: PresentationDefinition[] = [
  {
    id: 'test_presentation_definition_1',
    format: {
      jwt_vc: {
        alg: ['ES256K'],
      },
      jwt_vp: {
        alg: ['ES256K'],
      },
    },
    input_descriptors: [
      {
        id: 'GmCredential',
        name: 'Gm Credential',
        purpose: 'To verify you have a valid GmCredential',
        constraints: {
          fields: [
            {
              path: ['$.type.*'],
              filter: {
                type: 'string',
                pattern: 'GmCredential',
              },
            },
          ],
        },
      },
    ],
  },
];
