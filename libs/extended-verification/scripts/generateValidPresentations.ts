import { IIdentifier, VerifiableCredential } from '@veramo/core';
import { writeFile } from 'fs/promises';

import { Agent } from './utils';
import { createJWTPresentation } from './utils/createJWTPresentation';

export const generateValidPresentations = async (
  agent: Agent,
  didKeyIdentifier: IIdentifier,
  didEthrIdentifier: IIdentifier,
  validCredentialJWT: VerifiableCredential,
  validCredentialEIP712: VerifiableCredential,
  files: string[]
) => {
  // Create valid presentation with JWT proof (credential with JWT proof)
  let presentation = await agent.createVerifiablePresentation({
    presentation: {
      verifiableCredential: [validCredentialJWT],
      holder: didKeyIdentifier.did,
    },
    proofFormat: 'jwt',
  });

  await writeFile(
    'tests/data/presentation_valid_jwt.json',
    JSON.stringify(presentation)
  );
  files.push('presentation_valid_jwt');

  // Create valid presentation with EIP712 proof (credential with EIP712 proof)
  presentation = await agent.createVerifiablePresentation({
    presentation: {
      verifiableCredential: [validCredentialEIP712],
      holder: didEthrIdentifier.did,
    },
    proofFormat: 'EthereumEip712Signature2021',
  });

  await writeFile(
    'tests/data/presentation_valid_eip712.json',
    JSON.stringify(presentation)
  );
  files.push('presentation_valid_eip712');

  // Create valid presentation with JWT proof (credential with EIP712 proof)
  presentation = await agent.createVerifiablePresentation({
    presentation: {
      verifiableCredential: [validCredentialEIP712],
      holder: didKeyIdentifier.did,
    },
    proofFormat: 'jwt',
  });

  await writeFile(
    'tests/data/presentation_valid_jwt_credential_eip712.json',
    JSON.stringify(presentation)
  );
  files.push('presentation_valid_jwt_credential_eip712');

  // Create valid presentation with EIP712 proof (credential with JWT proof)
  presentation = await agent.createVerifiablePresentation({
    presentation: {
      verifiableCredential: [validCredentialJWT],
      holder: didEthrIdentifier.did,
    },
    proofFormat: 'EthereumEip712Signature2021',
  });

  await writeFile(
    'tests/data/presentation_valid_eip712_credential_jwt.json',
    JSON.stringify(presentation)
  );
  files.push('presentation_valid_eip712_credential_jwt');

  // Create valid presentation with JWT proof (credential with JWT proof and EIP712 proof)
  presentation = await agent.createVerifiablePresentation({
    presentation: {
      verifiableCredential: [validCredentialJWT, validCredentialEIP712],
      holder: didKeyIdentifier.did,
    },
    proofFormat: 'jwt',
  });

  await writeFile(
    'tests/data/presentation_valid_jwt_credential_jwt_eip712.json',
    JSON.stringify(presentation)
  );
  files.push('presentation_valid_jwt_credential_jwt_eip712');

  // Create valid presentation with EIP712 proof (credential with JWT proof and EIP712 proof)
  presentation = await agent.createVerifiablePresentation({
    presentation: {
      verifiableCredential: [validCredentialJWT, validCredentialEIP712],
      holder: didEthrIdentifier.did,
    },
    proofFormat: 'EthereumEip712Signature2021',
  });

  await writeFile(
    'tests/data/presentation_valid_eip712_credential_jwt_eip712.json',
    JSON.stringify(presentation)
  );
  files.push('presentation_valid_eip712_credential_jwt_eip712');

  // Create valid presentation with JWT proof, expiration date and not before date
  presentation = await createJWTPresentation(
    agent,
    didKeyIdentifier,
    [validCredentialJWT],
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365 * 10, // 10 years in the future
      nbf: Math.floor(Date.now() / 1000) + 1, // 1 second in the future
    }
  );

  await writeFile(
    'tests/data/presentation_valid_jwt_exp_nbf.json',
    JSON.stringify(presentation)
  );
  files.push('presentation_valid_jwt_exp_nbf');
};
