import { uint8ArrayToHex } from '@blockchain-lab-um/utils';
import {
  AbstractDataStore,
  type IFilterArgs,
  type IQueryResult,
} from '@blockchain-lab-um/veramo-datamanager';
import { DIDDataStore } from '@glazed/did-datastore';
import type { W3CVerifiableCredential } from '@veramo/core';
import { sha256 } from 'ethereum-cryptography/sha256.js';
import jsonpath from 'jsonpath';

import StorageService from '../../../storage/Storage.service';
import { aliases, getCeramic } from '../../../utils/ceramicUtils';
import { decodeJWT } from '../../../utils/jwt';

export interface StoredCredentials {
  vcs: Record<string, W3CVerifiableCredential>;
}
export class CeramicCredentialStore extends AbstractDataStore {
  async query(args: IFilterArgs): Promise<IQueryResult[]> {
    const { filter } = args;
    const state = StorageService.get();
    const ceramic = await getCeramic(state);
    const datastore = new DIDDataStore({ ceramic, model: aliases });
    const storedCredentials = await datastore.get('StoredCredentials')!;
    if (storedCredentials?.vcs) {
      if (filter && filter.type === 'id') {
        try {
          if (storedCredentials.vcs[filter.filter]) {
            let vc = storedCredentials.vcs[filter.filter] as unknown;
            if (typeof vc === 'string') {
              vc = decodeJWT(vc);
            }
            const obj = [
              {
                metadata: { id: filter.filter },
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
        const filteredObjects = jsonpath.query(objects, filter.filter);
        return filteredObjects as IQueryResult[];
      }
    }
    return [];
  }

  async delete({ id }: { id: string }) {
    const state = StorageService.get();
    const ceramic = await getCeramic(state);
    const datastore = new DIDDataStore({ ceramic, model: aliases });
    const storedCredentials = await datastore.get('StoredCredentials')!;
    if (storedCredentials?.vcs) {
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
    const state = StorageService.get();
    const ceramic = await getCeramic(state);
    const datastore = new DIDDataStore({ ceramic, model: aliases });
    const storedCredentials = await datastore.get('StoredCredentials')!;
    if (storedCredentials?.vcs) {
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
    const state = StorageService.get();
    const ceramic = await getCeramic(state);
    const datastore = new DIDDataStore({ ceramic, model: aliases });
    const storedCredentials = await datastore.get('StoredCredentials')!;
    if (storedCredentials?.vcs) {
      storedCredentials.vcs = {};
      await datastore.merge('StoredCredentials', storedCredentials);
      return true;
    }
    return false;
  }
}
