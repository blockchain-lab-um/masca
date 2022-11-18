import { addMulticodecPrefix } from '../../src/utils/formatUtils';
import { getCompressedPublicKey } from '../../src/utils/snapUtils';
import { publicKey } from '../testUtils/constants';

describe('formatUtils', () => {
  describe('addMulticodecPrefix', () => {
    it('should succeed adding multicodec prefix', () => {
      const res = addMulticodecPrefix(
        'secp256k1-pub',
        Buffer.from(getCompressedPublicKey(publicKey), 'hex')
      );
      const expected = Buffer.from(
        'e7010280a9cd48fd436f8c1f81b156eb615618cd573c3eb1e6d937a17b8222027cae85',
        'hex'
      );

      expect(res).toStrictEqual(expected);
      expect.assertions(1);
    });

    it('should fail adding multicodec prefix and throw error', () => {
      expect(() =>
        addMulticodecPrefix(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
          'UNKNOWN CODEC' as any,
          Buffer.from(getCompressedPublicKey(publicKey), 'hex')
        )
      ).toThrow(new Error('multicodec not recognized'));
      expect.assertions(1);
    });
  });
});
