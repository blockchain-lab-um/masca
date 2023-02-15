export const TEST_USER_PRIVATE_KEY =
  '0x63ce0077f0d617dbf54d5f335de2983313c6356f25b45e0f68f85bee1490a6ae';
export const TEST_ISSUER_URL = 'http://localhost:3000';
export const TEST_ISSUER_DB_SECRET =
  '29739248cad1bd1a0fc4d9b75cd4d2990de535baf5caadfdf8d8f86664aa830c';
export const TEST_SUPPORTED_SCHEMA_URL =
  'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json';
export const TEST_SUPPORTED_DID_METHODS = ['ethr', 'web'];
export const TEST_SUPPORTED_CURVES = ['secp256k1', 'P-256', 'P-384', 'P-521'];
export const TEST_SUPPORTED_DIGITAL_SIGNATURES = ['ES256K'];
export const TEST_INFURA_PROJECT_ID = '0ec03090465d400c988a14831aacfe37';
export const TEST_METADATA = {
  credential_issuer: 'http://localhost:3000',
  issuer: 'http://localhost:3000',
  authorization_endpoint: '',
  token_endpoint: 'http://localhost:3000/token',
  credential_endpoint: 'http://localhost:3000/credential',
  response_types_supported: [
    'code',
    'id_token',
    'id_token token',
    'code id_token',
    'code token',
    'code id_token token',
  ],
  credentials_supported: [
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
  ],
};
