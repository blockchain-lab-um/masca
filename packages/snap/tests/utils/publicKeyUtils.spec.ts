import { VerificationMethod } from 'did-resolver';
import { generateJWKfromVerificationMethod } from '../../src/did/jwk/jwkDidUtils';

const key: VerificationMethod = {
  id: 'did:key:zQ3shRjtvr2HwReUAB4BaDguwuzbpJUFu7MfrwmUHfPpiUBKz#zQ3shRjtvr2HwReUAB4BaDguwuzbpJUFu7MfrwmUHfPpiUBKz',
  type: 'EcdsaSecp256k1VerificationKey2019',
  controller: 'did:key:zQ3shRjtvr2HwReUAB4BaDguwuzbpJUFu7MfrwmUHfPpiUBKz',
  publicKeyHex:
    '026d42037b127c77646a9876b4f4791aff1707ad122d447a653f9509001ad1ad5c',
};

describe('Utils [public key]', () => {
  describe('publicKeyUtils', () => {
    it('should create JWK object', () => {
      const jwk = generateJWKfromVerificationMethod(key);
      expect(jwk).toBeDefined();
      expect(jwk.crv).toBe('secp256k1');
      expect(jwk.kty).toBe('EC');
      expect(typeof jwk.x).toBe('string');
      expect(typeof jwk.y).toBe('string');

      expect.assertions(5);
    });
  });
});
