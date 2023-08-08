import { isError, privateKeyToDid } from '@blockchain-lab-um/oidc-rp-plugin';
import { IIdentifier, MinimalImportableKey } from '@veramo/core';
import { bytesToBase64url, encodeBase64url } from '@veramo/utils';
import elliptic from 'elliptic';
import { sha256 } from 'ethereum-cryptography/sha256.js';
import { JWTPayload } from 'jose';
import { v4 as uuidv4 } from 'uuid';

import { Agent } from './testAgent.js';

const { ec: EC } = elliptic;

interface CreateJWTProofParams {
  privateKey: string;
  audience: string;
  data?: any;
  nonce?: string;
  options?: {
    did?: string;
    kid?: string;
  };
}

export const createJWTProof = async ({
  privateKey,
  audience,
  data,
  nonce,
  options,
}: CreateJWTProofParams) => {
  const ctx = new EC('secp256k1');
  const ecPrivateKey = ctx.keyFromPrivate(privateKey);

  let did;
  let kid;

  if (!options?.did) {
    const res = await privateKeyToDid({
      privateKey,
      didMethod: 'did:ethr',
    });

    if (isError(res)) {
      throw res.error;
    }

    did = res.data.did;
  } else {
    did = options.did;
  }

  if (!options?.kid) {
    kid = `${did}#controllerKey`;
  } else {
    kid = options.kid;
  }

  let jwtPayload: Partial<JWTPayload> = {
    aud: audience,
    sub: did,
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

interface ImportDidParams {
  agent: Agent;
  privateKey: string;
  alias: string;
  options?: {
    did: string;
    provider: string;
  };
}

export const importDid = async ({
  agent,
  alias,
  privateKey,
  options,
}: ImportDidParams): Promise<IIdentifier> => {
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

    let did;
    let provider;

    if (!options?.did) {
      const res = await privateKeyToDid({
        privateKey: key.privateKeyHex,
        didMethod: 'did:ethr',
      });

      if (isError(res)) {
        throw Error('Error while creating DID');
      }

      did = res.data.did;
      provider = 'did:ethr';
    } else {
      did = options.did;
      provider = options.provider;
    }

    return await agent.didManagerImport({
      did,
      alias,
      provider,
      controllerKeyId: uuid, // TODO: Handle key ID better
      keys: [key],
    });
  }
};
