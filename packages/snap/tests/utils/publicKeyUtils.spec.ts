import { VerificationMethod } from 'did-resolver';
import { generateJWKfromVerificationMethod } from '../../src/did/jwk/jwkDidUtils';

const key: VerificationMethod = {
  id: 'did:key:zQ3shRjtvr2HwReUAB4BaDguwuzbpJUFu7MfrwmUHfPpiUBKz#zQ3shRjtvr2HwReUAB4BaDguwuzbpJUFu7MfrwmUHfPpiUBKz',
  type: 'EcdsaSecp256k1VerificationKey2019',
  controller: 'did:key:zQ3shRjtvr2HwReUAB4BaDguwuzbpJUFu7MfrwmUHfPpiUBKz',
};

describe('Utils [public key]', () => {
  describe('publicKeyUtils', () => {
    it('should create JWK object from publicKeyHex', () => {
      key.publicKeyHex =
        '026d42037b127c77646a9876b4f4791aff1707ad122d447a653f9509001ad1ad5c';
      const jwk = generateJWKfromVerificationMethod(key);
      key.publicKeyHex = undefined;
      expect(jwk).toBeDefined();
      expect(jwk.crv).toBe('secp256k1');
      expect(jwk.kty).toBe('EC');
      expect(typeof jwk.x).toBe('string');
      expect(typeof jwk.y).toBe('string');

      expect.assertions(5);
    });
    it('should create JWK object from publicKeyJwk', () => {
      key.publicKeyJwk = {
        kty: 'EC',
        crv: 'secp256k1',
        x: 'QFPDKUjfamaqQL9fK_cgpfZx-eMKNnqPGev2dInNcF0',
        y: 'WtE4kmX3RyTM05ZsTEGP6wqQ_mjdojLMOELIXTk_CMI',
      };
      const jwk = generateJWKfromVerificationMethod(key);
      key.publicKeyJwk = undefined;
      expect(jwk).toBeDefined();
      expect(jwk.crv).toBe('secp256k1');
      expect(jwk.kty).toBe('EC');
      expect(typeof jwk.x).toBe('string');
      expect(typeof jwk.y).toBe('string');

      expect.assertions(5);
    });
    it('should create JWK object from publicKeyMultibase (base64)', () => {
      key.publicKeyBase64 = 'AkBTwylI32pmqkC/Xyv3IKX2cfnjCjZ6jxnr9nSJzXBd';
      const jwk = generateJWKfromVerificationMethod(key);
      key.publicKeyBase64 = undefined;
      expect(jwk).toBeDefined();
      expect(jwk.crv).toBe('secp256k1');
      expect(jwk.kty).toBe('EC');
      expect(typeof jwk.x).toBe('string');
      expect(typeof jwk.y).toBe('string');

      expect.assertions(5);
    });
    it('should create JWK object from publicKeyMultibase (base58)', () => {
      key.publicKeyBase58 = 'fnjuzspU71FGvxW9qc2u6QENei4vpodL1qiVN49bFhUG';
      const jwk = generateJWKfromVerificationMethod(key);
      key.publicKeyBase58 = undefined;
      expect(jwk).toBeDefined();
      expect(jwk.crv).toBe('secp256k1');
      expect(jwk.kty).toBe('EC');
      expect(typeof jwk.x).toBe('string');
      expect(typeof jwk.y).toBe('string');

      expect.assertions(5);
    });
  });
});
