import { isError, privateKeyToDid } from '@blockchain-lab-um/oidc-rp-plugin';
import { IIdentifier, MinimalImportableKey } from '@veramo/core';
import { bytesToBase64url, encodeBase64url } from '@veramo/utils';
import * as _EC from 'elliptic';
import { sha256 } from 'ethereum-cryptography/sha256.js';
import { JWTPayload } from 'jose';
import { v4 as uuidv4 } from 'uuid';

import { Agent } from './testAgent.js';

const EC = _EC.ec;

type CreateJWTProofParams = {
  privateKey: string;
  audience: string;
  data?: any;
  nonce?: string;
};

// eslint-disable-next-line import/prefer-default-export
export const createJWTProof = async ({
  privateKey,
  audience,
  data,
  nonce,
}: CreateJWTProofParams) => {
  const ctx = new EC('secp256k1');
  const ecPrivateKey = ctx.keyFromPrivate(privateKey);
  const res = await privateKeyToDid({
    privateKey,
    didMethod: 'did:ethr',
  });

  if (isError(res)) {
    throw new Error(res.error.message);
  }

  const { did } = res.data;
  const kid = `${did}#controllerKey`;

  let jwtPayload: Partial<JWTPayload> = {
    sub: audience,
    aud: audience,
    iss: did,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
    iat: Math.floor(Date.now() / 1000),
    nbf: Math.floor(Date.now() / 1000),
  };

  if (data) {
    jwtPayload = { ...jwtPayload, ...data };
  }

  if (nonce) {
    jwtPayload.nonce = nonce;
  }

  const jwtHeader = {
    alg: 'ES256K',
    kid,
  };

  const signingInput = [
    encodeBase64url(JSON.stringify(jwtHeader)),
    encodeBase64url(JSON.stringify(jwtPayload)),
  ].join('.');

  const hash = sha256(Buffer.from(signingInput));

  const signature = ecPrivateKey.sign(hash);

  const signatureBuffer = Buffer.concat([
    signature.r.toArrayLike(Buffer, 'be', 32),
    signature.s.toArrayLike(Buffer, 'be', 32),
  ]);

  const signatureBase64 = bytesToBase64url(signatureBuffer);

  const signedJwt = [signingInput, signatureBase64].join('.');

  return signedJwt;
};

export const importDid = async (
  agent: Agent,
  privateKey: string,
  alias: string
): Promise<IIdentifier> => {
  const uuid = uuidv4().replace(/-/g, '');
  try {
    // Check if did exists
    return await agent.didManagerGetByAlias({
      alias,
    });
  } catch (error) {
    // Create did if it doesn't exist
    const key: MinimalImportableKey = {
      kid: uuid,
      kms: 'local',
      type: 'Secp256k1',
      privateKeyHex: privateKey,
    };

    const res = await privateKeyToDid({
      privateKey: key.privateKeyHex,
      didMethod: 'did:ethr',
    });

    if (isError(res)) {
      throw Error('Error while creating DID');
    }

    const { did } = res.data;
    return await agent.didManagerImport({
      did,
      alias,
      provider: 'did:ethr',
      controllerKeyId: uuid, // TODO: Handle key ID better
      keys: [key],
    });
  }
};
