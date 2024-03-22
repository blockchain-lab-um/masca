import type { IIdentifier, VerifiableCredential } from '@veramo/core';
import { writeFile } from 'node:fs/promises';

import type { Agent } from './utils';
import { createJWTPresentation } from './utils/createJWTPresentation';

interface GenerateInvalidPresentationsOptions {
  agent: Agent;
  didKeyIdentifier: IIdentifier;
  didEthrIdentifier: IIdentifier;
  validCredentialJWT: VerifiableCredential;
  validCredentialEIP712: VerifiableCredential;
  expiredCredentialJWT: VerifiableCredential;
  files: string[];
}

export const generateInvalidPresentations = async ({
  agent,
  didKeyIdentifier,
  didEthrIdentifier,
  validCredentialJWT,
  validCredentialEIP712,
  expiredCredentialJWT,
  files,
}: GenerateInvalidPresentationsOptions) => {
  // Create invalid presentation with JWT proof and invalid signature (credential with JWT proof)
  let presentation = await agent.createVerifiablePresentation({
    presentation: {
      verifiableCredential: [validCredentialJWT],
      holder: didKeyIdentifier.did,
    },
    proofFormat: 'jwt',
  });

  const presentationJWT = presentation.proof.jwt as string;

  const wrontPresentationJWT = (
    await agent.createVerifiablePresentation({
      presentation: {
        verifiableCredential: [validCredentialEIP712],
        holder: didKeyIdentifier.did,
      },
      proofFormat: 'jwt',
    })
  ).proof.jwt as string;

  const wrongJWTData = wrontPresentationJWT.split('.')[1];

  presentation.proof.jwt = `${presentationJWT.split('.')[0]}.${wrongJWTData}.${
    presentationJWT.split('.')[2]
  }`;

  await writeFile(
    'tests/data/presentation_invalid_jwt_signature.json',
    JSON.stringify(presentation)
  );
  files.push('presentation_invalid_jwt_signature');

  // Create invalid presentation with EIP712 proof and invalid signature (credential with EIP712 proof)
  presentation = await agent.createVerifiablePresentation({
    presentation: {
      verifiableCredential: [validCredentialEIP712],
      holder: didEthrIdentifier.did,
    },
    proofFormat: 'EthereumEip712Signature2021',
  });

  presentation.holder =
    'did:ethr:0x02124db92658f81bcb6f4e909c55aa26315e5360dd08004ab444ebed87e428bebb';

  await writeFile(
    'tests/data/presentation_invalid_eip712_signature.json',
    JSON.stringify(presentation)
  );
  files.push('presentation_invalid_eip712_signature');

  const invalidCredentialEIP712 = structuredClone(validCredentialEIP712);
  invalidCredentialEIP712.credentialSubject.username = 'bob';

  // Create invalid presentation with JWT proof (credential with EIP712 proof and invalid signature)
  presentation = await createJWTPresentation(agent, didKeyIdentifier, [
    invalidCredentialEIP712,
  ]);

  await writeFile(
    'tests/data/presentation_invalid_jwt_credential_eip712_signature.json',
    JSON.stringify(presentation)
  );
  files.push('presentation_invalid_jwt_credential_eip712_signature');

  // Create invalid presentation with JWT proof not yet valid (credential with JWT proof)
  presentation = await createJWTPresentation(
    agent,
    didKeyIdentifier,
    [validCredentialJWT],
    {
      nbf: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365 * 10, // 10 years in the future
    }
  );

  await writeFile(
    'tests/data/presentation_invalid_jwt_nbf.json',
    JSON.stringify(presentation)
  );
  files.push('presentation_invalid_jwt_nbf');

  // Create invalid presentation with JWT proof expired (credential with JWT proof)
  presentation = await createJWTPresentation(
    agent,
    didKeyIdentifier,
    [validCredentialJWT],
    {
      exp: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 365, // 1 year in the past
    }
  );

  await writeFile(
    'tests/data/presentation_invalid_jwt_exp.json',
    JSON.stringify(presentation)
  );
  files.push('presentation_invalid_jwt_exp');

  // Create invalid presentation with JWT proof (credential with JWT proof and expired)
  presentation = await agent.createVerifiablePresentation({
    presentation: {
      verifiableCredential: [expiredCredentialJWT],
      holder: didKeyIdentifier.did,
    },
    proofFormat: 'jwt',
  });

  await writeFile(
    'tests/data/presentation_invalid_jwt_credential_expired.json',
    JSON.stringify(presentation)
  );
  files.push('presentation_invalid_jwt_credential_expired');

  // Create invalid presentation with JWT proof (expired JWT credential and valid EIP712 credential)
  presentation = await agent.createVerifiablePresentation({
    presentation: {
      verifiableCredential: [validCredentialEIP712, expiredCredentialJWT],
      holder: didKeyIdentifier.did,
    },
    proofFormat: 'jwt',
  });

  await writeFile(
    'tests/data/presentation_invalid_jwt_credential_eip712_credential_jwt_expired.json',
    JSON.stringify(presentation)
  );

  files.push(
    'presentation_invalid_jwt_credential_eip712_credential_jwt_expired'
  );
};
