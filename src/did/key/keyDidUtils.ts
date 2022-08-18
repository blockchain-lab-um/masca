/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { getCompressedPublicKey } from '../../utils/snapUtils';
import Multibase from 'multibase';
import Multicodec from 'multicodec';
import { SnapProvider } from '@metamask/snap-types';

export async function getDidKeyIdentifier(
  wallet: SnapProvider
): Promise<string> {
  const compressedKey = await getCompressedPublicKey(wallet);
  const DID = Buffer.from(
    Multibase.encode(
      'base58btc',
      Multicodec.addPrefix('secp256k1-pub', Buffer.from(compressedKey, 'hex'))
    )
  ).toString();
  console.log(DID);
  return DID;
}
