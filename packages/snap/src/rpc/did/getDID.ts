import { BIP44CoinTypeNode } from '@metamask/key-tree';

import type { ApiParams } from '../../interfaces';
import { getCurrentDidIdentifier } from '../../utils/didUtils';

export async function getDid(params: ApiParams): Promise<string> {
  const identifier = await getCurrentDidIdentifier({
    ethereum: params.ethereum,
    snap: params.snap,
    state: params.state,
    account: params.account,
    bip44CoinTypeNode: params.bip44CoinTypeNode as BIP44CoinTypeNode,
  });
  return identifier.did;
}
