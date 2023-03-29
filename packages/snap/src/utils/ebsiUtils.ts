import { BIP44CoinTypeNode } from '@metamask/key-tree';
import { IDIDManagerCreateArgs } from '@veramo/core';
import { keccak256 } from 'ethers/lib/utils';

import { ApiParams } from '../interfaces';
import { getAgent } from '../veramo/setup';
import { snapGetKeysFromAddress } from './keyPair';

export async function getDidEbsiIdentifier(
  params: ApiParams,
  args: IDIDManagerCreateArgs
): Promise<string> {
  // args.options.bearer je bearer token
  const { state, snap, account, bip44CoinTypeNode } = params;
  const agent = await getAgent(snap, ethereum);
  const provider = state.accountState[account].accountConfig.ssi.didMethod;

  const res = await snapGetKeysFromAddress(
    bip44CoinTypeNode as BIP44CoinTypeNode,
    state,
    account,
    snap
  );
  try {
    const identifier = await agent.didManagerCreate({
      provider,
      kms: 'web3',
      options: {
        ...args.options,
        privateKey: res?.privateKey,
        id: keccak256(Buffer.from(res?.privateKey as string)).slice(2, 18), // usually random 16 bytes, in our case first 16 bytes of keccak hashed priv key
      },
    });
    return identifier.did;
  } catch (e) {
    console.log(e);
    return '';
  }
}
