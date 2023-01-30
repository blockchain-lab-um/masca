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

export function generateJWKfromKey(key: VerificationMethod) {
  /* const key = {
    id: 'did:key:zQ3shRjtvr2HwReUAB4BaDguwuzbpJUFu7MfrwmUHfPpiUBKz#zQ3shRjtvr2HwReUAB4BaDguwuzbpJUFu7MfrwmUHfPpiUBKz',
    type: 'EcdsaSecp256k1VerificationKey2019',
    controller: 'did:key:zQ3shRjtvr2HwReUAB4BaDguwuzbpJUFu7MfrwmUHfPpiUBKz',
    // publicKeyJwk: {
    //   kty: "EC",
    //   crv: "secp256k1",
    //   x: "QFPDKUjfamaqQL9fK_cgpfZx-eMKNnqPGev2dInNcF0",
    //   y: "WtE4kmX3RyTM05ZsTEGP6wqQ_mjdojLMOELIXTk_CMI",
    // },
    // publicKeyBase64: "AkBTwylI32pmqkC/Xyv3IKX2cfnjCjZ6jxnr9nSJzXBd",
    // publicKeyBase58: "fnjuzspU71FGvxW9qc2u6QENei4vpodL1qiVN49bFhUG",
    publicKeyHex:
      '026d42037b127c77646a9876b4f4791aff1707ad122d447a653f9509001ad1ad5c',
  }; */
  let bytes = extractPublicKeyBytes(key);

  let hex = bytesToHex(bytes);
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

export function getJwkDidUrl(did: string) {
  return `${did}#0`;
}
