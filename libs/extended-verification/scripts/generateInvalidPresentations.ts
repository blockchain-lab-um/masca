import { writeFile } from 'fs/promises';
import { IIdentifier, VerifiableCredential } from '@veramo/core';

import { Agent } from './utils';
import { createJWTPresentation } from './utils/createJWTPresentation';

export const generateInvalidPresentations = async (
  agent: Agent,
  didKeyIdentifier: IIdentifier,
  didEthrIdentifier: IIdentifier,
  validCredentialJWT: VerifiableCredential,
  validCredentialEIP712: VerifiableCredential,
  invalidCredentialJWT: VerifiableCredential,
  expiredCredentialJWT: VerifiableCredential
) => {
  // Create invalid presentation with JWT proof and invalid signature (credential with JWT proof)
  let presentation = await agent.createVerifiablePresentation({
    presentation: {
      verifiableCredential: [validCredentialJWT],
      holder: didKeyIdentifier.did,
    },
    proofFormat: 'jwt',
  });

  presentation.holder =
    'did:key:z6MkrxhJ9rwaheU8gHA5BspFeqemxz4HJAX7oPjKahh7oVEP';

  await writeFile(
    'tests/data/presentation_invalid_jwt_signature.json',
    JSON.stringify(presentation)
  );

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

  // Create invalid presentation with JWT proof (credential with JWT proof and invalid signature)ž
  presentation = await agent.createVerifiablePresentation({
    presentation: {
      verifiableCredential: [invalidCredentialJWT],
      holder: didKeyIdentifier.did,
    },
    proofFormat: 'jwt',
  });

  await writeFile(
    'tests/data/presentation_invalid_jwt_credential_jwt_signature.json',
    JSON.stringify(presentation)
  );

  // Create invalid presentation with JWT proof not yet valid (credential with JWT proof)ž
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

  // Create invalid presentation with JWT proof expired (credential with JWT proof)ž
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
};
