import { getCompressedPublicKey, getPublicKey } from '../../utils/snapUtils';
import Multibase from 'multibase';
import Multicodec from 'multicodec';
import { SnapProvider } from '@metamask/snap-types';

export async function getDidKeyIdentifier(
  wallet: SnapProvider,
  account: string
): Promise<string> {
  const publicKey = await getPublicKey(wallet, account);
  const compressedKey = getCompressedPublicKey(publicKey);
  const DID = Buffer.from(
    Multibase.encode(
      'base58btc',
      Multicodec.addPrefix('secp256k1-pub', Buffer.from(compressedKey, 'hex'))
    )
  ).toString();
  console.log(DID);
  return DID;
}
