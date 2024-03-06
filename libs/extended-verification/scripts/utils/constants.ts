export const CREDENTIAL_DATA = {
  '@context': ['https://www.w3.org/2018/credentials/v1'],
  credentialSchema: {
    id: 'https://example.org/examples/degree.json',
    type: 'JsonSchemaValidator2018',
  },
  type: ['VerifiableCredential', 'TestCredential'],
  credentialSubject: {
    id: 'did:key:zQ3shnhrtE43gzU9bFdGFPnDrVSmGWUZmnKinSw8LBvrWmHop',
    username: 'alice',
  },
};
