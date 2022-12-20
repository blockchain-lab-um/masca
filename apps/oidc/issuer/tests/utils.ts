import { ec as EC } from 'elliptic';
import { sha256 } from 'ethereum-cryptography/sha256';
import { JWTPayload } from 'jose';
import { encodeBase64url, bytesToBase64url } from '@veramo/utils';
import { isError, OIDCPlugin } from '@blockchain-lab-um/oidc-rp-plugin';

// eslint-disable-next-line import/prefer-default-export
export const createJWTProof = async (
  privateKey: string,
  audience: string,
  nonce?: string
) => {
  const ctx = new EC('secp256k1');
  const ecPrivateKey = ctx.keyFromPrivate(privateKey);
  const res = await OIDCPlugin.privateKeyToDid(privateKey, 'did:ethr');
  console.log('res: ', res);

  if (isError(res)) {
    throw new Error(res.error.message);
  }

  const { did } = res.data;
  console.log(did);
  const kid = `${did}#controllerKey`;
  console.log(`kid: ${kid}`);

  const jwtPayload: Partial<JWTPayload> = {
    sub: audience,
    aud: audience,
    iss: did,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
    iat: Math.floor(Date.now() / 1000),
    nbf: Math.floor(Date.now() / 1000),
  };

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
  // ecPrivateKey.ec.recoverPubKey(hash, signature, signature.recoveryParam);

  const signatureBuffer = Buffer.concat([
    signature.r.toArrayLike(Buffer, 'be', 32),
    signature.s.toArrayLike(Buffer, 'be', 32),
  ]);

  const signatureBase64 = bytesToBase64url(signatureBuffer);

  const signedJwt = [signingInput, signatureBase64].join('.');

  return signedJwt;
};
