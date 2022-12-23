import { ec as EC } from 'elliptic';
import { sha256 } from 'ethereum-cryptography/sha256';
import { JWTPayload } from 'jose';
import { encodeBase64url, bytesToBase64url } from '@veramo/utils';
import { isError, OIDCPlugin } from '@blockchain-lab-um/oidc-rp-plugin';
import { MinimalImportableKey } from '@veramo/core';
import { v4 as uuidv4 } from 'uuid';
import { Agent } from './testAgent';

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
  const res = await OIDCPlugin.privateKeyToDid(privateKey, 'did:ethr');

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

export const importKey = async (
  agent: Agent,
  privateKey: string,
  alias: string
) => {
  const uuid = uuidv4();
  try {
    // Check if did exists
    await agent.didManagerGetByAlias({
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

    const res = await OIDCPlugin.privateKeyToDid(key.privateKeyHex, 'did:ethr');

    if (isError(res)) {
      throw Error('Error while creating DID');
    }

    const { did } = res.data;

    await agent.didManagerImport({
      did,
      alias,
      provider: 'did:ethr',
      controllerKeyId: uuid, // TODO: Handle key ID better
      keys: [key],
    });
  }
};
