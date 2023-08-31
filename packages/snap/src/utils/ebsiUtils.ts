import {
  CURRENT_STATE_VERSION,
  type MascaState,
} from '@blockchain-lab-um/masca-types';
import type { IDIDManagerCreateArgs } from '@veramo/core';
import { keccak256 } from 'ethers';
import WalletService from 'src/Wallet.service';

import VeramoService from '../veramo/Veramo.service';

/**
 * Function that creates a new EBSI identifier.
 * @param params.state - Masca state
 * @param params.snap - Snaps global object
 * @param params.account - Account to create the identifier for
 * @param params.args - Optional arguments for the DID manager create method
 * @returns string - DID
 */
export async function getDidEbsiIdentifier(params: {
  state: MascaState;
  account: string;
  args: IDIDManagerCreateArgs;
}): Promise<string> {
  const { state, account, args } = params;

  const agent = VeramoService.getAgent();
  const provider =
    state[CURRENT_STATE_VERSION].accountState[account].general.account.ssi
      .selectedMethod;

  const res = WalletService.get();

  try {
    const idBuffer = Buffer.from(res?.privateKey);
    const identifier = await agent.didManagerCreate({
      provider,
      kms: 'web3',
      options: {
        ...args.options,
        privateKey: res?.privateKey,
        id: keccak256(idBuffer).slice(2, 18), // usually random 16 bytes, in our case first 16 bytes of keccak hashed priv key
      },
    });
    idBuffer.fill(0);
    return identifier.did;
  } catch (e) {
    throw new Error(
      `Failed to create new EBSI identifier: ${(e as Error).message}`
    );
  }
}
