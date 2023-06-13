import {
  AbstractDataStore,
  type IFilterArgs,
  type IQueryResult,
} from '@blockchain-lab-um/veramo-datamanager';
import { DIDDataStore } from '@glazed/did-datastore';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';
import type { W3CVerifiableCredential } from '@veramo/core';
import { sha256 } from 'ethereum-cryptography/sha256.js';
import jsonpath from 'jsonpath';

import { uint8ArrayToHex } from '@blockchain-lab-um/utils';
import { aliases, getCeramic } from '../../../utils/ceramicUtils';
import { decodeJWT } from '../../../utils/jwt';
import { getSnapState } from '../../../utils/stateUtils';

export type StoredCredentials = {
  vcs: Record<string, W3CVerifiableCredential>;
};
export class CeramicVCStore extends AbstractDataStore {
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
    const ceramic = await getCeramic(this.ethereum, this.snap, state);
    const datastore = new DIDDataStore({ ceramic, model: aliases });
    const storedCredentials = (await datastore.get(
      'StoredCredentials'
    )) as StoredCredentials;
    if (storedCredentials && storedCredentials.vcs) {
      if (filter && filter.type === 'id') {
        try {
          if (storedCredentials.vcs[filter.filter as string]) {
            let vc = storedCredentials.vcs[filter.filter as string] as unknown;
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
        return Object.keys(storedCredentials.vcs).map((k) => {
          let vc = storedCredentials.vcs[k] as unknown;
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
        const objects = Object.keys(storedCredentials.vcs).map((k) => {
          let vc = storedCredentials.vcs[k] as unknown;
          if (typeof vc === 'string') {
            vc = decodeJWT(vc);
          }
          return {
            metadata: { id: k },
            data: vc,
          };
        });
        const filteredObjects = jsonpath.query(
          objects,
          filter.filter as string
        );
        return filteredObjects as Array<IQueryResult>;
      }
    }
    return [];
  }

  async delete({ id }: { id: string }) {
    const state = await getSnapState(this.snap);
    const ceramic = await getCeramic(this.ethereum, this.snap, state);
    const datastore = new DIDDataStore({ ceramic, model: aliases });
    const storedCredentials = (await datastore.get(
      'StoredCredentials'
    )) as StoredCredentials;
    if (storedCredentials && storedCredentials.vcs) {
      if (!storedCredentials.vcs[id]) throw Error('ID not found');

      delete storedCredentials.vcs[id];
      await datastore.merge('StoredCredentials', storedCredentials);
      return true;
    }
    return false;
  }

  async save(args: { data: W3CVerifiableCredential }): Promise<string> {
    // TODO check if VC is correct type

    const vc = args.data;
    const state = await getSnapState(this.snap);
    const ceramic = await getCeramic(this.ethereum, this.snap, state);
    const datastore = new DIDDataStore({ ceramic, model: aliases });
    const storedCredentials = (await datastore.get(
      'StoredCredentials'
    )) as StoredCredentials;
    if (storedCredentials && storedCredentials.vcs) {
      const id = uint8ArrayToHex(sha256(Buffer.from(JSON.stringify(vc))));

      if (storedCredentials.vcs[id]) {
        return id;
      }

      storedCredentials.vcs[id] = vc;
      await datastore.merge('StoredCredentials', storedCredentials);
      return id;
    }
    const id = uint8ArrayToHex(sha256(Buffer.from(JSON.stringify(vc))));
    const storedCredentialsNew: StoredCredentials = { vcs: {} };
    storedCredentialsNew.vcs[id] = vc;
    await datastore.merge('StoredCredentials', storedCredentialsNew);
    return id;
  }

  public async clear(_args: IFilterArgs): Promise<boolean> {
    const state = await getSnapState(this.snap);
    const ceramic = await getCeramic(this.ethereum, this.snap, state);
    const datastore = new DIDDataStore({ ceramic, model: aliases });
    const storedCredentials = (await datastore.get(
      'StoredCredentials'
    )) as StoredCredentials;
    if (storedCredentials && storedCredentials.vcs) {
      storedCredentials.vcs = {};
      await datastore.merge('StoredCredentials', storedCredentials);
      return true;
    }
    return false;
  }
}
