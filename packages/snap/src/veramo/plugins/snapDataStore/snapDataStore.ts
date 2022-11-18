import { RequireOnly, IIdentifier } from '@veramo/core';
import { ManagedPrivateKey } from '@veramo/key-manager';
import { AbstractDIDStore } from '@veramo/did-manager';
import { v4 as uuidv4 } from 'uuid';
import { VerifiableCredential } from '@veramo/core';
import { getSnapState, updateSnapState } from '../../../utils/stateUtils';
import { SnapRpcHandler } from '@metamask/snaps-types';
import { getCurrentAccount } from '../../../utils/snapUtils';
import { AbstractVCStore } from '@blockchain-lab-um/veramo-vc-manager';

export type ImportablePrivateKey = RequireOnly<
  ManagedPrivateKey,
  'privateKeyHex' | 'type'
>;

/**
 * An implementation of {@link AbstractDIDStore} that holds everything in snap state.
 *
 * This is usable by {@link @veramo/did-manager} to hold the did key data.
 */

export class SnapDIDStore extends AbstractDIDStore {
  wallet: SnapRpcHandler;
  constructor(walletParam: SnapRpcHandler) {
    super();
    this.wallet = walletParam;
  }

  async get({
    did,
    alias,
    provider,
  }: {
    did: string;
    alias: string;
    provider: string;
  }): Promise<IIdentifier> {
    const state = await getSnapState(this.wallet);
    const account = await getCurrentAccount(this.wallet);
    if (!account) throw Error('User denied error');
    const identifiers = state.accountState[account].identifiers;

    if (did && !alias) {
      if (!identifiers[did])
        throw Error(`not_found: IIdentifier not found with did=${did}`);
      return identifiers[did];
    } else if (!did && alias && provider) {
      for (const key of Object.keys(identifiers)) {
        if (
          identifiers[key].alias === alias &&
          identifiers[key].provider === provider
        ) {
          return identifiers[key];
        }
      }
    } else {
      throw Error('invalid_argument: Get requires did or (alias and provider)');
    }
    throw Error(
      `not_found: IIdentifier not found with alias=${alias} provider=${provider}`
    );
  }

  async delete({ did }: { did: string }) {
    const state = await getSnapState(this.wallet);
    const account = await getCurrentAccount(this.wallet);
    if (!account) throw Error('User denied error');

    if (!state.accountState[account].identifiers[did])
      throw Error('Identifier not found');

    delete state.accountState[account].identifiers[did];
    await updateSnapState(this.wallet, state);
    return true;
  }

  async import(args: IIdentifier) {
    const state = await getSnapState(this.wallet);
    const account = await getCurrentAccount(this.wallet);
    if (!account) throw Error('User denied error');

    const identifier = { ...args };
    for (const key of identifier.keys) {
      if ('privateKeyHex' in key) {
        delete key.privateKeyHex;
      }
    }
    state.accountState[account].identifiers[args.did] = identifier;
    await updateSnapState(this.wallet, state);
    return true;
  }

  async list(args: {
    alias?: string;
    provider?: string;
  }): Promise<IIdentifier[]> {
    const state = await getSnapState(this.wallet);
    const account = await getCurrentAccount(this.wallet);
    if (!account) throw Error('User denied error');

    let result: IIdentifier[] = [];
    for (const key of Object.keys(state.accountState[account].identifiers)) {
      result.push(state.accountState[account].identifiers[key]);
    }

    if (args.alias && !args.provider) {
      result = result.filter((i) => i.alias === args.alias);
    } else if (args.provider && !args.alias) {
      result = result.filter((i) => i.provider === args.provider);
    } else if (args.provider && args.alias) {
      result = result.filter(
        (i) => i.provider === args.provider && i.alias === args.alias
      );
    }

    return result;
  }
}

/**
 * An implementation of {@link AbstractVCStore} that holds everything in snap state.
 *
 * This is usable by {@link @vc-manager/VCManager} to hold the vc data
 */

export class SnapVCStore extends AbstractVCStore {
  wallet: SnapRpcHandler;
  constructor(walletParam: SnapRpcHandler) {
    super();
    this.wallet = walletParam;
  }

  async get(args: { id: string }): Promise<VerifiableCredential | null> {
    const state = await getSnapState(this.wallet);
    const account = await getCurrentAccount(this.wallet);
    if (!account) throw Error('User denied error');

    if (!state.accountState[account].vcs[args.id])
      throw Error(`not_found: VC with key=${args.id} not found!`);
    return state.accountState[account].vcs[args.id];
  }

  async delete({ id }: { id: string }) {
    const state = await getSnapState(this.wallet);
    const account = await getCurrentAccount(this.wallet);
    if (!account) throw Error('User denied error');

    if (!state.accountState[account].vcs[id]) throw Error('VC not found');

    delete state.accountState[account].vcs[id];
    await updateSnapState(this.wallet, state);
    return true;
  }

  async import(args: VerifiableCredential) {
    const state = await getSnapState(this.wallet);
    const account = await getCurrentAccount(this.wallet);
    if (!account) throw Error('User denied error');

    let alias = uuidv4();
    while (state.accountState[account].vcs[alias]) {
      alias = uuidv4();
    }

    state.accountState[account].vcs[alias] = { ...args };
    await updateSnapState(this.wallet, state);
    return true;
  }

  async list(): Promise<VerifiableCredential[]> {
    const state = await getSnapState(this.wallet);
    const account = await getCurrentAccount(this.wallet);
    if (!account) throw Error('User denied error');
    const result: VerifiableCredential[] = [];

    // TODO: Why we adding key -> we have id ?
    // Return type doesn't match with what we return
    Object.keys(state.accountState[account].vcs).forEach((key) => {
      result.push({ ...state.accountState[account].vcs[key], key: key });
    });

    return result;
  }
}
