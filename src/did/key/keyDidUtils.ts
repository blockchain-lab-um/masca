import { getCompressedPublicKey } from '../../utils/snapUtils';
import Multibase from 'multibase';
import Multicodec from 'multicodec';

export async function getDidKeyIdentifier(): Promise<string> {
  const compressedKey = await getCompressedPublicKey();
  const DID = Buffer.from(
    Multibase.encode(
      'base58btc',
      Multicodec.addPrefix('secp256k1-pub', Buffer.from(compressedKey, 'hex'))
    )
  ).toString();
  console.log(DID);
  return DID;
}
