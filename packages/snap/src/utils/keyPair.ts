import {
  getBIP44AddressKeyDeriver,
  BIP44CoinTypeNode,
} from '@metamask/key-tree';
import { SnapProvider } from '@metamask/snap-types';

export async function getAddressKeyDeriver(wallet: SnapProvider) {
  // By way of example, we will use Dogecoin, which has `coin_type` 3.
  const dogecoinNode = (await wallet.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType: 60,
    },
  })) as BIP44CoinTypeNode;

  // Next, we'll create an address key deriver function for the Dogecoin coin_type node.
  // In this case, its path will be: m / 44' / 3' / 0' / 0 / address_index
  const deriveDogecoinAddress = await getBIP44AddressKeyDeriver(dogecoinNode);

  // These are BIP-44 nodes containing the extended private keys for
  // the respective derivation paths.

  // m / 44' / 3' / 0' / 0 / 0
  const addressKey0 = await deriveDogecoinAddress(0);

  // m / 44' / 3' / 0' / 0 / 1
  const addressKey1 = await deriveDogecoinAddress(1);

  console.log('PK:', addressKey0);
  console.log('PK:', addressKey1);

  // Now, you can ask the user to e.g. sign transactions!
}
