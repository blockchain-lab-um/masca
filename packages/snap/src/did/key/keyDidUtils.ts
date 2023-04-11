import { util } from '@cef-ebsi/key-did-resolver';
import { bytesToBase64url, hexToBytes } from '@veramo/utils';
import { ec as EC } from 'elliptic';
import { base58btc } from 'multiformats/bases/base58';

import { MascaState } from '../../interfaces';
import { addMulticodecPrefix } from '../../utils/formatUtils';
import { getCompressedPublicKey } from '../../utils/snapUtils';

export function getDidKeyIdentifier(
  state: MascaState,
  account: string
): string {
  const compressedKey = getCompressedPublicKey(
    state.accountState[account].publicKey
  );

  return Buffer.from(
    base58btc.encode(
      addMulticodecPrefix('secp256k1-pub', Buffer.from(compressedKey, 'hex'))
    )
  ).toString();
}

export function getDidEbsiKeyIdentifier(
  state: MascaState,
  account: string
): string {
  const curve = new EC('secp256k1');
  const publicKey = curve.keyFromPublic(
    state.accountState[account].publicKey.slice(2),
    'hex'
  );
  const y = bytesToBase64url(
    hexToBytes(publicKey.getPublic().getY().toString('hex'))
  );
  const x = bytesToBase64url(
    hexToBytes(publicKey.getPublic().getX().toString('hex'))
  );
  const jwk = {
    kty: 'EC',
    crv: 'secp256k1',
    x,
    y,
  };
  const did = util.createDid(jwk);
  return did.split(':')[2];
}
