import type { SignArgs } from '@blockchain-lab-um/oidc-client-plugin';
import { bytesToBase64url, encodeBase64url } from '@veramo/utils';
import elliptic from 'elliptic';
import { sha256 } from 'ethers';

const { ec: EC } = elliptic;

export type SignOptions = {
  privateKey: string;
  did: string;
  kid: string;
};

export const sign = async (signArgs: SignArgs, signOptions: SignOptions) => {
  const { privateKey, did, kid } = signOptions;
  const ctx = new EC('secp256k1');

  const ecPrivateKey = ctx.keyFromPrivate(privateKey.slice(2));

  const jwtPayload = {
    ...signArgs.payload,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
    iat: Math.floor(Date.now() / 1000),
    nbf: Math.floor(Date.now() / 1000),
    iss: did,
    sub: did,
  };

  const jwtHeader = {
    ...signArgs.header,
    alg: 'ES256K',
    kid,
  };

  const signingInput = [
    encodeBase64url(JSON.stringify(jwtHeader)),
    encodeBase64url(JSON.stringify(jwtPayload)),
  ].join('.');

  const hash = sha256(Buffer.from(signingInput));

  const signature = ecPrivateKey.sign(hash.slice(2));

  const signatureBuffer = Buffer.concat([
    signature.r.toArrayLike(Buffer, 'be', 32),
    signature.s.toArrayLike(Buffer, 'be', 32),
  ]);

  const signatureBase64 = bytesToBase64url(signatureBuffer);

  const signedJwt = [signingInput, signatureBase64].join('.');

  return signedJwt;
};
