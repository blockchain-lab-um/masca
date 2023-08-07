import type { SignArgs } from '@blockchain-lab-um/oidc-client-plugin';
import { bytesToBase64url, encodeBase64url } from '@veramo/utils';
import elliptic from 'elliptic';
import { sha256 } from 'ethereum-cryptography/sha256';

const { ec: EC } = elliptic;

export interface SignOptions {
  privateKey: string;
  curve: 'secp256k1' | 'p256';
  did: string;
  kid: string;
}

/**
 * Function that signs a JWT.
 * @param signArgs - SignArgs object
 * @param signOptions - SignOptions object
 * @returns string - signed JWT
 */
export const sign = async (signArgs: SignArgs, signOptions: SignOptions) => {
  const { privateKey, did, kid, curve } = signOptions;
  const ctx = new EC(curve);

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
    alg: curve === 'secp256k1' ? 'ES256K' : 'ES256',
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
