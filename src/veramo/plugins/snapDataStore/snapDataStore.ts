import { IKey, RequireOnly, IIdentifier } from '@veramo/core';
import { AbstractKeyStore } from '@veramo/key-manager';
import {
  AbstractPrivateKeyStore,
  ManagedPrivateKey,
} from '@veramo/key-manager';
import { AbstractDIDStore } from '@veramo/did-manager';
import { v4 as uuidv4 } from 'uuid';
import { AbstractVCStore } from '@blockchain-lab-um/veramo-vc-manager/build/vc-store/abstract-vc-store';
import { VerifiableCredential } from '@veramo/core';
import {
  getSnapState,
  updateAccountState,
  updateSnapState,
} from '../../../utils/stateUtils';
import { SnapProvider } from '@metamask/snap-types';
import { getCurrentAccount } from '../../../utils/snapUtils';

export type ImportablePrivateKey = RequireOnly<
  ManagedPrivateKey,
  'privateKeyHex' | 'type'
>;

/**
 * An implementation of {@link AbstractKeyStore} that holds everything in snap state.
 *
 * This is usable by {@link @veramo/kms-local} to hold the private key data.
 */

export class SnapKeyStore extends AbstractKeyStore {
  wallet: SnapProvider;
  constructor(walletParam: SnapProvider) {
    super();
    this.wallet = walletParam;
  }
  private keys: Record<string, IKey> = {};

  async get({ kid }: { kid: string }): Promise<IKey> {
    const state = await getSnapState(this.wallet);
    const account = await getCurrentAccount(this.wallet);
    if (!account) throw Error('User denied error');

    const key = state.accountState[account].snapKeyStore[kid];
    if (!key) throw Error('Key not found');
    return key;
  }

  async delete({ kid }: { kid: string }) {
    const state = await getSnapState(this.wallet);
    const account = await getCurrentAccount(this.wallet);
    if (!account) throw Error('User denied error');

    if (!state.accountState[account].snapKeyStore[kid])
      throw Error('Key not found');

    delete state.accountState[account].snapKeyStore[kid];
    await updateSnapState(this.wallet, state);
    return true;
  }

  async import(args: IKey) {
    const state = await getSnapState(this.wallet);
    const account = await getCurrentAccount(this.wallet);
    if (!account) throw Error('User denied error');

    state.accountState[account].snapKeyStore[args.kid] = { ...args };
    await updateSnapState(this.wallet, state);
    return true;
  }

  async list(): Promise<Exclude<IKey, 'privateKeyHex'>[]> {
    const state = await getSnapState(this.wallet);
    const account = await getCurrentAccount(this.wallet);
    if (!account) throw Error('User denied error');

    const safeKeys = Object.values(
      state.accountState[account].snapKeyStore
    ).map((key) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { privateKeyHex, ...safeKey } = key;
      return safeKey;
    });
    return safeKeys;
  }
}

/**
 * An implementation of {@link AbstractPrivateKeyStore} that holds everything in snap state.
 *
 * This is usable by {@link @veramo/kms-local} to hold the key data.
 */

export class SnapPrivateKeyStore extends AbstractPrivateKeyStore {
  wallet: SnapProvider;
  constructor(walletParam: SnapProvider) {
    super();
    this.wallet = walletParam;
  }

  async get({ alias }: { alias: string }): Promise<ManagedPrivateKey> {
    const state = await getSnapState(this.wallet);
    const account = await getCurrentAccount(this.wallet);
    if (!account) throw Error('User denied error');

    const key = state.accountState[account].snapPrivateKeyStore[alias];
    if (!key) throw Error(`not_found: PrivateKey not found for alias=${alias}`);
    return key;
  }

  async delete({ alias }: { alias: string }) {
    const state = await getSnapState(this.wallet);
    const account = await getCurrentAccount(this.wallet);
    if (!account) throw Error('User denied error');

    if (!state.accountState[account].snapPrivateKeyStore[alias])
      throw Error('Key not found');

    delete state.accountState[account].snapPrivateKeyStore[alias];
    await updateSnapState(this.wallet, state);
    return true;
  }

  async import(args: ImportablePrivateKey) {
    const state = await getSnapState(this.wallet);
    const account = await getCurrentAccount(this.wallet);
    if (!account) throw Error('User denied error');

    const alias = args.alias || uuidv4();
    const existingEntry =
      state.accountState[account].snapPrivateKeyStore[alias];
    if (existingEntry && existingEntry.privateKeyHex !== args.privateKeyHex) {
      throw new Error(
        'key_already_exists: key exists with different data, please use a different alias'
      );
    }
    state.accountState[account].snapPrivateKeyStore[alias] = { ...args, alias };
    await updateSnapState(this.wallet, state);
    return state.accountState[account].snapPrivateKeyStore[alias];
  }

  async list(): Promise<Array<ManagedPrivateKey>> {
    const state = await getSnapState(this.wallet);
    const account = await getCurrentAccount(this.wallet);
    if (!account) throw Error('User denied error');

    return [...Object.values(state.accountState[account].snapPrivateKeyStore)];
  }
}

/**
 * An implementation of {@link AbstractDIDStore} that holds everything in snap state.
 *
 * This is usable by {@link @veramo/did-manager} to hold the did key data.
 */

export class SnapDIDStore extends AbstractDIDStore {
  wallet: SnapProvider;
  constructor(walletParam: SnapProvider) {
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
      if (key.privateKeyHex) {
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
  wallet: SnapProvider;
  constructor(walletParam: SnapProvider) {
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
