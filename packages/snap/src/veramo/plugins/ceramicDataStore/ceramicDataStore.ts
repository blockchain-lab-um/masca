import { v4 as uuidv4 } from 'uuid';
import { W3CVerifiableCredential } from '@veramo/core';
import { aliases, getCeramic } from '../../../utils/ceramicUtils';
import { DIDDataStore } from '@glazed/did-datastore';
import { SnapProvider } from '@metamask/snap-types';
import { AbstractDataStore } from '@blockchain-lab-um/veramo-vc-manager';
import { FilterArgs, QueryRes } from 'src/interfaces';
import jsonpath from 'jsonpath';
import { decodeJWT } from '../../../utils/jwt';

export type StoredCredentials = {
  vcs: Record<string, W3CVerifiableCredential>;
};
export class CeramicVCStore extends AbstractDataStore {
  wallet: SnapProvider;
  constructor(walletParam: SnapProvider) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super();
    this.wallet = walletParam;
  }

  async query(args: FilterArgs): Promise<QueryRes[]> {
    const { filter } = args;
    const ceramic = await getCeramic(this.wallet);
    const datastore = new DIDDataStore({ ceramic, model: aliases });
    const storedCredentials = (await datastore.get(
      'StoredCredentials'
    )) as StoredCredentials;
    console.log('QUERY', storedCredentials);
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
          } else return [];
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
        //TODO convert JWT strings to VC objects
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
        return filteredObjects as Array<QueryRes>;
      }
    }
    return [];
  }

  async delete({ id }: { id: string }) {
    const ceramic = await getCeramic(this.wallet);
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
    //TODO check if VC is correct type

    const vc = args.data;
    const ceramic = await getCeramic(this.wallet);
    const datastore = new DIDDataStore({ ceramic, model: aliases });
    const storedCredentials = (await datastore.get(
      'StoredCredentials'
    )) as StoredCredentials;
    if (storedCredentials && storedCredentials.vcs) {
      let id = uuidv4();
      while (storedCredentials.vcs[id]) {
        id = uuidv4();
      }

      storedCredentials.vcs[id] = vc;
      await datastore.merge('StoredCredentials', storedCredentials);
      return id;
    } else {
      const id = uuidv4();
      const storedCredentialsNew: StoredCredentials = { vcs: {} };
      storedCredentialsNew.vcs[id] = vc;
      await datastore.merge('StoredCredentials', storedCredentialsNew);
      return id;
    }
  }

  public async clear(args: FilterArgs): Promise<boolean> {
    const ceramic = await getCeramic(this.wallet);
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
