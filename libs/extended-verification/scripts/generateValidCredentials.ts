import type { IIdentifier } from '@veramo/core';
import { writeFile } from 'node:fs/promises';

import { type Agent, CREDENTIAL_DATA, createJWTCredential } from './utils';

export const generateValidCredentials = async (
  agent: Agent,
  didKeyIdentifier: IIdentifier,
  didEthrIdentifier: IIdentifier,
  files: string[]
) => {
  // Create valid credential with JWT proof
  let credential = await agent.createVerifiableCredential({
    credential: { ...CREDENTIAL_DATA, issuer: didKeyIdentifier.did },
    proofFormat: 'jwt',
  });

  await writeFile(
    'tests/data/credential_valid_jwt.json',
    JSON.stringify(credential)
  );
  files.push('credential_valid_jwt');

  // Create valid credential with EIP712 proof
  credential = await agent.createVerifiableCredential({
    credential: { ...CREDENTIAL_DATA, issuer: didEthrIdentifier.did },
    proofFormat: 'EthereumEip712Signature2021',
  });

  await writeFile(
    'tests/data/credential_valid_eip712.json',
    JSON.stringify(credential)
  );
  files.push('credential_valid_eip712');

  // Create valid credential with JWT proof, expiration date and not before date
  credential = await createJWTCredential(agent, didKeyIdentifier, {
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365 * 10, // 10 years in the future
    nbf: Math.floor(Date.now() / 1000) + 1, // 1 second in the future
  });

  await writeFile(
    'tests/data/credential_valid_jwt_exp_nbf.json',
    JSON.stringify(credential)
  );
  files.push('credential_valid_jwt_exp_nbf');
};
