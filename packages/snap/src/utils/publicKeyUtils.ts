import { DIDDocument, VerificationMethod, type JsonWebKey } from 'did-resolver';
import elliptic from 'elliptic';
import { bases } from 'multiformats/basics';
import {
  hexToBytes,
  bytesToHex,
  base64ToBytes,
  base58ToBytes,
  bytesToBase64url,
} from '@veramo/utils';
import { getUncompressedPublicKey, toEthereumAddress } from './snapUtils';

export function extractPublicKeyBytes(pk: VerificationMethod): Uint8Array {
  if (pk.publicKeyBase58) {
    return base58ToBytes(pk.publicKeyBase58);
  } else if (pk.publicKeyMultibase) {
    return bases['base58btc'].decode(pk.publicKeyMultibase);
  } else if (pk.publicKeyBase64) {
    return base64ToBytes(pk.publicKeyBase64);
  } else if (pk.publicKeyHex) {
    return hexToBytes(pk.publicKeyHex);
  } else if (
    pk.publicKeyJwk &&
    pk.publicKeyJwk.crv === 'secp256k1' &&
    pk.publicKeyJwk.x &&
    pk.publicKeyJwk.y
  ) {
    const secp256k1 = new elliptic.ec('secp256k1');
    return hexToBytes(
      secp256k1
        .keyFromPublic({
          x: bytesToHex(base64ToBytes(pk.publicKeyJwk.x)),
          y: bytesToHex(base64ToBytes(pk.publicKeyJwk.y)),
        })
        .getPublic('hex')
    );
  } else if (
    pk.publicKeyJwk &&
    pk.publicKeyJwk.crv === 'Ed25519' &&
    pk.publicKeyJwk.x
  ) {
    return base64ToBytes(pk.publicKeyJwk.x);
  }
  return new Uint8Array();
}

export function generateJWK() {
  const key = {
    id: 'did:key:zQ3shRjtvr2HwReUAB4BaDguwuzbpJUFu7MfrwmUHfPpiUBKz#zQ3shRjtvr2HwReUAB4BaDguwuzbpJUFu7MfrwmUHfPpiUBKz',
    type: 'EcdsaSecp256k1VerificationKey2019',
    controller: 'did:key:zQ3shRjtvr2HwReUAB4BaDguwuzbpJUFu7MfrwmUHfPpiUBKz',
    // publicKeyJwk: {
    //   kty: "EC",
    //   crv: "secp256k1",
    //   x: "QFPDKUjfamaqQL9fK_cgpfZx-eMKNnqPGev2dInNcF0",
    //   y: "WtE4kmX3RyTM05ZsTEGP6wqQ_mjdojLMOELIXTk_CMI",
    // },
    //publicKeyBase64: "AkBTwylI32pmqkC/Xyv3IKX2cfnjCjZ6jxnr9nSJzXBd",
    //publicKeyBase58: "fnjuzspU71FGvxW9qc2u6QENei4vpodL1qiVN49bFhUG",
    publicKeyHex:
      '026d42037b127c77646a9876b4f4791aff1707ad122d447a653f9509001ad1ad5c',
  };
  let bytes = extractPublicKeyBytes(key);
  console.log(bytes);
  let hex = bytesToHex(bytes);
  if (hex.substring(0, 2) === '02' || hex.substring(0, 2) === '03') {
    hex = getUncompressedPublicKey(hex as string);
    console.log('new hex', hex);
    bytes = hexToBytes(hex);
  }
  console.log(hex);
  const addr = toEthereumAddress(hex);
  console.log(addr);

  console.log('Generating JWK');
  var ec = new elliptic.ec('secp256k1');
  const pk = ec.keyFromPublic(bytes);
  const pubPoint = pk.getPublic();
  console.log(pubPoint);
  var x = pubPoint.getX();
  var y = pubPoint.getY();
  console.log(x, y);
  var pub = {
    x: bytesToBase64url(hexToBytes(x.toString('hex'))),
    y: bytesToBase64url(hexToBytes(y.toString('hex'))),
  };
  console.log(pub);
  return undefined;
}
