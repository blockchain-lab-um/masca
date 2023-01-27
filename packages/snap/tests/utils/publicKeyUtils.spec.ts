import { VerificationMethod } from 'did-resolver';
import { generateJWKfromKey } from '../../src/did/jwk/jwkDidUtils';

const key: VerificationMethod = {
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

describe('Utils [public key]', () => {
  describe('publicKeyUtils', () => {
    it('should create JWK object', () => {
      const jwk = generateJWKfromKey(key);
      expect(jwk).toBeDefined();
      console.log(jwk);
      expect(jwk.crv).toBe('secp256k1');
      expect(jwk.kty).toBe('EC');
      expect(typeof jwk.x).toBe('string');
      expect(typeof jwk.y).toBe('string');

      expect.assertions(5);
    });
  });
});
