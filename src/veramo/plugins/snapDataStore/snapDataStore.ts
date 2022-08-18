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
import { getAccountState, updateAccountState } from '../../../utils/stateUtils';
import { SnapProvider } from '@metamask/snap-types';

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
  // FIXME: Check if this works as intended
  wallet: SnapProvider;
  constructor(walletParam: SnapProvider) {
    super();
    this.wallet = walletParam;
  }
  private keys: Record<string, IKey> = {};

  async get({ kid }: { kid: string }): Promise<IKey> {
    const ssiAccountState = await getAccountState(this.wallet);
    const key = ssiAccountState.snapKeyStore[kid];
    if (!key) throw Error('Key not found');
    return key;
  }

  async delete({ kid }: { kid: string }) {
    const ssiAccountState = await getAccountState(this.wallet);
    try {
      delete ssiAccountState.snapKeyStore[kid];
    } catch (e) {
      return false;
    }
    return true;
  }

  async import(args: IKey) {
    const ssiAccountState = await getAccountState(this.wallet);
    ssiAccountState.snapKeyStore[args.kid] = { ...args };
    await updateAccountState(this.wallet, ssiAccountState);
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types
  async list(args: {}): Promise<Exclude<IKey, 'privateKeyHex'>[]> {
    const ssiAccountState = await getAccountState(this.wallet);
    const safeKeys = Object.values(ssiAccountState.snapKeyStore).map((key) => {
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
    const ssiAccountState = await getAccountState(this.wallet);
    const key = ssiAccountState.snapPrivateKeyStore[alias];
    if (!key) throw Error(`not_found: PrivateKey not found for alias=${alias}`);
    return key;
  }

  async delete({ alias }: { alias: string }) {
    const ssiAccountState = await getAccountState(this.wallet);
    try {
      delete ssiAccountState.snapPrivateKeyStore[alias];
    } catch (e) {
      return false;
    }
    return true;
  }

  async import(args: ImportablePrivateKey) {
    const ssiAccountState = await getAccountState(this.wallet);
    const alias = args.alias || uuidv4();
    const existingEntry = ssiAccountState.snapPrivateKeyStore[alias];
    if (existingEntry && existingEntry.privateKeyHex !== args.privateKeyHex) {
      throw new Error(
        'key_already_exists: key exists with different data, please use a different alias'
      );
    }
    ssiAccountState.snapPrivateKeyStore[alias] = { ...args, alias };
    await updateAccountState(this.wallet, ssiAccountState);
    return ssiAccountState.snapPrivateKeyStore[alias];
  }

  async list(): Promise<Array<ManagedPrivateKey>> {
    const ssiAccountState = await getAccountState(this.wallet);
    return [...Object.values(ssiAccountState.snapPrivateKeyStore)];
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
    const ssiAccountState = await getAccountState(this.wallet);
    if (did && !alias) {
      if (!ssiAccountState.identifiers[did])
        throw Error(`not_found: IIdentifier not found with did=${did}`);
      return ssiAccountState.identifiers[did];
    } else if (!did && alias && provider) {
      for (const key of Object.keys(ssiAccountState.identifiers)) {
        if (
          ssiAccountState.identifiers[key].alias === alias &&
          ssiAccountState.identifiers[key].provider === provider
        ) {
          return ssiAccountState.identifiers[key];
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
    const ssiAccountState = await getAccountState(this.wallet);
    try {
      delete ssiAccountState.identifiers[did];
    } catch (e) {
      return false;
    }
    return true;
  }

  async import(args: IIdentifier) {
    const ssiAccountState = await getAccountState(this.wallet);
    const identifier = { ...args };
    for (const key of identifier.keys) {
      if (key.privateKeyHex) {
        delete key.privateKeyHex;
      }
    }
    ssiAccountState.identifiers[args.did] = identifier;
    await updateAccountState(this.wallet, ssiAccountState);
    return true;
  }

  async list(args: {
    alias?: string;
    provider?: string;
  }): Promise<IIdentifier[]> {
    const ssiAccountState = await getAccountState(this.wallet);
    let result: IIdentifier[] = [];

    for (const key of Object.keys(ssiAccountState.identifiers)) {
      result.push(ssiAccountState.identifiers[key]);
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
    const ssiAccountState = await getAccountState(this.wallet);
    const vc = ssiAccountState.vcs[args.id];
    if (!vc) throw Error(`not_found: VC with key=${args.id} not found!`);
    return vc;
  }

  async delete({ id }: { id: string }) {
    const ssiAccountState = await getAccountState(this.wallet);
    try {
      delete ssiAccountState.vcs[id];
    } catch (e) {
      return false;
    }
    return true;
  }

  async import(args: VerifiableCredential) {
    const ssiAccountState = await getAccountState(this.wallet);
    let alias = uuidv4();

    while (ssiAccountState.vcs[alias]) {
      alias = uuidv4();
    }

    ssiAccountState.vcs[alias] = { ...args };
    await updateAccountState(this.wallet, ssiAccountState);
    return true;
  }

  async list(): Promise<VerifiableCredential[]> {
    const ssiAccountState = await getAccountState(this.wallet);

    const result: VerifiableCredential[] = [];

    Object.keys(ssiAccountState.vcs).forEach((key) => {
      result.push({ ...ssiAccountState.vcs[key], key: key });
    });

    return result;
  }
}
