import type { MascaState } from '@blockchain-lab-um/masca-types';
import type { SnapsGlobalObject } from '@metamask/snaps-types';
import type { IDIDManagerCreateArgs } from '@veramo/core';
import { keccak256 } from 'ethers';
import WalletService from 'src/Wallet.service';

import VeramoService from '../veramo/Veramo.service';

export async function getDidEbsiIdentifier(params: {
  state: MascaState;
  snap: SnapsGlobalObject;
  account: string;
  args: IDIDManagerCreateArgs;
}): Promise<string> {
  const { state, snap, account, args } = params;

  const agent = VeramoService.getAgent();
  const provider = state.accountState[account].accountConfig.ssi.didMethod;

  const res = WalletService.get();

  try {
    const identifier = await agent.didManagerCreate({
      provider,
      kms: 'web3',
      options: {
        ...args.options,
        privateKey: res?.privateKey,
        id: keccak256(Buffer.from(res?.privateKey)).slice(2, 18), // usually random 16 bytes, in our case first 16 bytes of keccak hashed priv key
      },
    });
    return identifier.did;
  } catch (e) {
    throw new Error(
      `Failed to create new EBSI identifier: ${(e as Error).message}`
    );
  }
}
