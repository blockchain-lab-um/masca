import { getCompressedPublicKey } from '../../utils/snapUtils';
import Multibase from 'multibase';
import Multicodec from 'multicodec';
import { SSISnapState } from '../../interfaces';

export function getDidKeyIdentifier(
  state: SSISnapState,
  account: string
): string {
  const compressedKey = getCompressedPublicKey(
    state.accountState[account].publicKey
  );

  return Buffer.from(
    Multibase.encode(
      'base58btc',
      Multicodec.addPrefix('secp256k1-pub', Buffer.from(compressedKey, 'hex'))
    )
  ).toString();
}
