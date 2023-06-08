import { BIP44CoinTypeNode } from '@metamask/key-tree';

import type { ApiParams } from '../../interfaces';
import { getCurrentDid } from '../../utils/didUtils';

export async function getDid(params: ApiParams): Promise<string> {
  return getCurrentDid({
    ethereum: params.ethereum,
    snap: params.snap,
    state: params.state,
    account: params.account,
    bip44CoinTypeNode: params.bip44CoinTypeNode as BIP44CoinTypeNode,
  });
}
