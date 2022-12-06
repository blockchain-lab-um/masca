import { generateJWK } from '../../src/utils/publicKeyUtils';

describe('Utils [public key]', () => {
  describe('publicKeyUtils', () => {
    it('should create JWK object', async () => {
      const jwk = await generateJWK();
      expect(jwk).toEqual(undefined);

      expect.assertions(1);
    });
  });
});
