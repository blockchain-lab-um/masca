import { writeFile } from 'fs/promises';
import { IIdentifier } from '@veramo/core';

import { Agent, createJWTCredential, CREDENTIAL_DATA } from './utils';

export const generateInvalidCredentials = async (
  agent: Agent,
  didKeyIdentifier: IIdentifier,
  didEthrIdentifier: IIdentifier,
  files: string[]
) => {
  // Create expired credential with JWT proof
  let credential: any = await createJWTCredential(agent, didKeyIdentifier, {
    exp: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 365, // 1 year in the past
  });

  await writeFile(
    'tests/data/credential_invalid_jwt_exp.json',
    JSON.stringify(credential)
  );
  files.push('credential_invalid_jwt_exp');

  // Create not yet valid credential with JWT proof
  credential = await createJWTCredential(agent, didKeyIdentifier, {
    nbf: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365 * 10, // 10 years in the future
  });

  await writeFile(
    'tests/data/credential_invalid_jwt_nbf.json',
    JSON.stringify(credential)
  );
  files.push('credential_invalid_jwt_nbf');

  // Create invalid credential with JWT proof (invalid signature)
  credential = await createJWTCredential(agent, didKeyIdentifier);
  credential.credentialSubject.username = 'bob';

  await writeFile(
    'tests/data/credential_invalid_jwt_signature.json',
    JSON.stringify(credential)
  );
  files.push('credential_invalid_jwt_signature');

  // TODO: Create invalid credential with JWT proof (invalid schema)
  credential = await agent.createVerifiableCredential({
    credential: {
      ...CREDENTIAL_DATA,
      issuer: didKeyIdentifier.did,
      credentialSchema: {
        id: 'https://example.org/examples/degree.json',
        type: 'InvalidSchema',
      },
    },
    proofFormat: 'jwt',
  });

  await writeFile(
    'tests/data/credential_invalid_jwt_schema.json',
    JSON.stringify(credential)
  );
  files.push('credential_invalid_jwt_schema');

  // Create invalid credential with EIP712 proof (invalid signature)
  credential = await agent.createVerifiableCredential({
    credential: { ...CREDENTIAL_DATA, issuer: didEthrIdentifier.did },
    proofFormat: 'EthereumEip712Signature2021',
  });

  credential.credentialSubject.username = 'bob';

  await writeFile(
    'tests/data/credential_invalid_eip712_signature.json',
    JSON.stringify(credential)
  );
  files.push('credential_invalid_eip712_signature');
};
