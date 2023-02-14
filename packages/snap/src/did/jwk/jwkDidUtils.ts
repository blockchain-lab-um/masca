import { VerificationMethod, type JsonWebKey } from 'did-resolver';
import { hexToBytes, bytesToHex, bytesToBase64url } from '@veramo/utils';
import { ec as EC } from 'elliptic';
import { extractPublicKeyBytes } from '../../utils/publicKeyUtils';
import { SSISnapState } from '../../interfaces';
import {
  getUncompressedPublicKey,
  getCompressedPublicKey,
  base64urlEncode,
} from '../../utils/snapUtils';

function createJWK(
  pubKey: string | Uint8Array | Buffer | number[]
): JsonWebKey {
  const ec = new EC('secp256k1');
  const pk = ec.keyFromPublic(pubKey, 'hex');
  const pubPoint = pk.getPublic();
  const x = pubPoint.getX();
  const y = pubPoint.getY();

  const jwk: JsonWebKey = {
    crv: 'secp256k1',
    kty: 'EC',
    x: bytesToBase64url(hexToBytes(x.toString('hex'))),
    y: bytesToBase64url(hexToBytes(y.toString('hex'))),
  };

  return jwk;
}

export function generateJWKfromVerificationMethod(key: VerificationMethod) {
  let bytes = extractPublicKeyBytes(key);
  let hex = bytesToHex(bytes);
  // Checks if the key is compressed
  if (hex.substring(0, 2) === '02' || hex.substring(0, 2) === '03') {
    hex = getUncompressedPublicKey(hex);
    bytes = hexToBytes(hex);
  }

  return createJWK(bytes);
}

export function getDidJwkIdentifier(
  state: SSISnapState,
  account: string
): string {
  const compressedKey = getCompressedPublicKey(
    state.accountState[account].publicKey
  );
  const jwk = createJWK(compressedKey);

  return base64urlEncode(JSON.stringify(jwk));
}
