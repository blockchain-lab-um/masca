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
