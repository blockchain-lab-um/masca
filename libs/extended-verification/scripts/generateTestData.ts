import { generateInvalidCredentials } from './generateInvalidCredentials';
import { generateInvalidPresentations } from './generateInvalidPresentations';
import { generateValidCredentials } from './generateValidCredentials';
import { generateValidPresentations } from './generateValidPresentations';
import {
  createJWTCredential,
  createVeramoAgent,
  CREDENTIAL_DATA,
} from './utils';
import { createEntrypoint } from './utils/createEntrypoint';

// TODO:
// Credentials:
// - Revoked credential
// - Credential with invalid schema
// - Credential with issuer not in EBIS Trusted Issuer registry
// Presentations:
// - Presentation with revoked credential
// - Presentation with invalid credential schema
// - Presentation with issuer not in EBIS Trusted Issuer registry
const main = async () => {
  // Create Veramo agent
  const agent = await createVeramoAgent();

  // Create DIDs (Key and Ethr)
  const didKeyIdentifier = await agent.didManagerCreate({
    provider: 'did:key',
    options: { keyType: 'Secp256k1' },
  });
  const didEthrIdentifier = await agent.didManagerCreate({
    provider: 'did:ethr',
  });

  // Create valid credentials for creating valid presentations
  const validCredentialJWT = await agent.createVerifiableCredential({
    credential: {
      ...structuredClone(CREDENTIAL_DATA),
      issuer: didKeyIdentifier.did,
    },
    proofFormat: 'jwt',
  });

  const validCredentialEIP712 = await agent.createVerifiableCredential({
    credential: {
      ...structuredClone(CREDENTIAL_DATA),
      issuer: didEthrIdentifier.did,
    },
    proofFormat: 'EthereumEip712Signature2021',
  });

  // Create invalid credentials for creating invalid presentations
  // Expired
  const expiredCredentialJWT = await createJWTCredential(
    agent,
    didKeyIdentifier,
    {
      exp: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 365, // 1 year in the past
    }
  );

  // Array of names of generated files
  const files: string[] = [];

  await generateValidCredentials(
    agent,
    didKeyIdentifier,
    didEthrIdentifier,
    files
  );
  await generateInvalidCredentials(
    agent,
    didKeyIdentifier,
    didEthrIdentifier,
    files
  );
  await generateValidPresentations(
    agent,
    didKeyIdentifier,
    didEthrIdentifier,
    validCredentialJWT,
    validCredentialEIP712,
    files
  );
  await generateInvalidPresentations({
    agent,
    didKeyIdentifier,
    didEthrIdentifier,
    validCredentialJWT,
    validCredentialEIP712,
    expiredCredentialJWT,
    files,
  });

  await createEntrypoint(files);
};

main().catch(console.error);
