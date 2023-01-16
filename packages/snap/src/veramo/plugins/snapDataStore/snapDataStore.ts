/* eslint-disable max-classes-per-file */
import { MetaMaskInpageProvider } from '@metamask/providers';
import {
  RequireOnly,
  IIdentifier,
  W3CVerifiableCredential,
} from '@veramo/core';
import { ManagedPrivateKey } from '@veramo/key-manager';
import { AbstractDIDStore } from '@veramo/did-manager';
import { v4 as uuidv4 } from 'uuid';
import { SnapsGlobalObject } from '@metamask/snaps-types';
import {
  AbstractDataStore,
  IFilterArgs,
  IQueryResult,
} from '@blockchain-lab-um/veramo-vc-manager';
import jsonpath from 'jsonpath';
import { getSnapState, updateSnapState } from '../../../utils/stateUtils';
import { getCurrentAccount } from '../../../utils/snapUtils';
import { decodeJWT } from '../../../utils/jwt';

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
  snap: SnapsGlobalObject;

  ethereum: MetaMaskInpageProvider;

  constructor(
    snapParam: SnapsGlobalObject,
    ethereumParam: MetaMaskInpageProvider
  ) {
    super();
    this.snap = snapParam;
    this.ethereum = ethereumParam;
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
    const state = await getSnapState(this.snap);
    const account = await getCurrentAccount(this.ethereum);
    if (!account) throw Error('User denied error');
    const { identifiers } = state.accountState[account];

    if (did && !alias) {
      if (!identifiers[did])
        throw Error(`not_found: IIdentifier not found with did=${did}`);
      return identifiers[did];
    }
    if (!did && alias && provider) {
      // eslint-disable-next-line no-restricted-syntax
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
    const state = await getSnapState(this.snap);
    const account = await getCurrentAccount(this.ethereum);
    if (!account) throw Error('User denied error');

    if (!state.accountState[account].identifiers[did])
      throw Error('Identifier not found');

    delete state.accountState[account].identifiers[did];
    await updateSnapState(this.snap, state);
    return true;
  }

  async import(args: IIdentifier) {
    const state = await getSnapState(this.snap);
    const account = await getCurrentAccount(this.ethereum);
    if (!account) throw Error('User denied error');

    const identifier = { ...args };
    // eslint-disable-next-line no-restricted-syntax
    for (const key of identifier.keys) {
      if ('privateKeyHex' in key) {
        delete key.privateKeyHex;
      }
    }
    state.accountState[account].identifiers[args.did] = identifier;
    await updateSnapState(this.snap, state);
    return true;
  }

  async list(args: {
    alias?: string;
    provider?: string;
  }): Promise<IIdentifier[]> {
    const state = await getSnapState(this.snap);
    const account = await getCurrentAccount(this.ethereum);
    if (!account) throw Error('User denied error');

    let result: IIdentifier[] = [];
    // eslint-disable-next-line no-restricted-syntax
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
 * An implementation of {@link AbstractDataStore} that holds everything in snap state.
 */
export class SnapVCStore extends AbstractDataStore {
  snap: SnapsGlobalObject;

  ethereum: MetaMaskInpageProvider;

  constructor(
    snapParam: SnapsGlobalObject,
    ethereumParam: MetaMaskInpageProvider
  ) {
    super();
    this.snap = snapParam;
    this.ethereum = ethereumParam;
  }

  async query(args: IFilterArgs): Promise<Array<IQueryResult>> {
    const { filter } = args;
    const state = await getSnapState(this.snap);
    const account = await getCurrentAccount(this.ethereum);
    if (!account) throw Error('Cannot get current account');

    if (filter && filter.type === 'id') {
      try {
        if (state.accountState[account].vcs[filter.filter as string]) {
          let vc = state.accountState[account].vcs[
            filter.filter as string
          ] as unknown;
          if (typeof vc === 'string') {
            vc = decodeJWT(vc);
          }
          const obj = [
            {
              metadata: { id: filter.filter as string },
              data: vc,
            },
          ];
          return obj;
        }
        return [];
      } catch (e) {
        throw new Error('Invalid id');
      }
    }
    if (filter === undefined || (filter && filter.type === 'none')) {
      return Object.keys(state.accountState[account].vcs).map((k) => {
        let vc = state.accountState[account].vcs[k] as unknown;
        if (typeof vc === 'string') {
          vc = decodeJWT(vc);
        }
        return {
          metadata: { id: k },
          data: vc,
        };
      });
    }
    if (filter && filter.type === 'JSONPath') {
      const objects = Object.keys(state.accountState[account].vcs).map((k) => {
        let vc = state.accountState[account].vcs[k] as unknown;
        if (typeof vc === 'string') {
          vc = decodeJWT(vc);
        }
        return {
          metadata: { id: k },
          data: vc,
        };
      });
      const filteredObjects = jsonpath.query(objects, filter.filter as string);
      return filteredObjects as Array<IQueryResult>;
    }
    return [];
  }

  async delete({ id }: { id: string }) {
    const state = await getSnapState(this.snap);
    const account = await getCurrentAccount(this.ethereum);
    if (!account) throw Error('Cannot get current account');

    if (!state.accountState[account].vcs[id]) throw Error('ID not found');

    delete state.accountState[account].vcs[id];
    await updateSnapState(this.snap, state);
    return true;
  }

  async save(args: { data: W3CVerifiableCredential }): Promise<string> {
    // TODO check if VC is correct type

    const vc = args.data;
    const state = await getSnapState(this.snap);
    const account = await getCurrentAccount(this.ethereum);
    if (!account) throw Error('Cannot get current account');

    let id = uuidv4();
    while (state.accountState[account].vcs[id]) {
      id = uuidv4();
    }

    state.accountState[account].vcs[id] = vc;
    await updateSnapState(this.snap, state);
    return id;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async clear(args: IFilterArgs): Promise<boolean> {
    // TODO implement filter (in ceramic aswell)
    const state = await getSnapState(this.snap);
    const account = await getCurrentAccount(this.ethereum);
    if (!account) throw Error('Cannot get current account');

    state.accountState[account].vcs = {};
    return true;
  }
}
