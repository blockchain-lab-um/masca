import {
  DetailedError,
  isError,
  privateKeyToDid,
} from '@blockchain-lab-um/oidc-rp-plugin';
import { MinimalImportableKey } from '@veramo/core';
import { bytesToBase64url, encodeBase64url } from '@veramo/utils';
import elliptic from 'elliptic';
import { sha256 } from 'ethereum-cryptography/sha256.js';
import { JWTPayload } from 'jose';
import { v4 as uuidv4 } from 'uuid';

import { Agent } from './testAgent.js';

const { ec: EC } = elliptic;

type CreateJWTProofParams = {
  privateKey: string;
  audience?: string;
  bindingType: 'kid' | 'jwk' | 'x5c';
  data?: unknown;
  typ?: string;
  invalidHeader?: boolean;
  invalidFragment?: boolean;
  headerExtra?: any;
};

export const createJWTProof = async ({
  privateKey,
  audience,
  bindingType,
  data,
  typ,
  invalidHeader,
  invalidFragment,
  headerExtra,
}: CreateJWTProofParams) => {
  const ctx = new EC('secp256k1');
  const ecPrivateKey = ctx.keyFromPrivate(privateKey);

  let jwtPayload: Partial<JWTPayload> = {
    ...(audience && { sub: audience }),
    ...(audience && { aud: audience }),
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
    iat: Math.floor(Date.now() / 1000),
    nbf: Math.floor(Date.now() / 1000),
  };

  if (data) {
    jwtPayload = { ...jwtPayload, ...data };
  }

  let jwtHeader;
  if (invalidHeader) {
    jwtHeader = 'invalid';
  } else {
    jwtHeader = {
      alg: 'ES256K',
      ...(typ && { typ }),
    };

    if (bindingType === 'kid') {
      const res = await privateKeyToDid({
        privateKey,
        didMethod: 'did:ethr',
      });

      if (isError(res)) {
        throw res.error;
      }

      const { did } = res.data;

      let kid = `${did}#controllerKey`;

      if (invalidFragment) {
        kid = `${did}#invalid`;
      }

      jwtHeader = {
        ...jwtHeader,
        kid,
      };
    } else if (bindingType === 'jwk') {
      const jwk = {
        kty: 'EC',
        crv: 'secp256k1',
        x: encodeBase64url(ecPrivateKey.getPublic().getX().toString('hex')),
        y: encodeBase64url(ecPrivateKey.getPublic().getY().toString('hex')),
      };

      jwtHeader = {
        ...jwtHeader,
        jwk,
      };
    } else {
      const x5c = 'Random x5c';

      jwtHeader = {
        ...jwtHeader,
        x5c,
      };
    }

    if (headerExtra) {
      jwtHeader = {
        ...jwtHeader,
        ...headerExtra,
      };
    }
  }

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

    const res = await privateKeyToDid({
      privateKey: key.privateKeyHex,
      didMethod: 'did:ethr',
    });

    if (isError(res)) {
      throw new DetailedError(
        'internal_server_error',
        'Error while creating a DID',
        500
      );
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
