import { getCompressedPublicKey } from '../../utils/snapUtils';
import { SSISnapState } from '../../interfaces';
import { base58btc } from 'multiformats/bases/base58';
import { addPrefix } from '../../utils/formatUtils';

export function getDidKeyIdentifier(
  state: SSISnapState,
  account: string
): string {
  const compressedKey = getCompressedPublicKey(
    state.accountState[account].publicKey
  );

  return Buffer.from(
    base58btc.encode(
      addPrefix('secp256k1-pub', Buffer.from(compressedKey, 'hex'))
    )
  ).toString();
}
