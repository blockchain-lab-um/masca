import { CeramicClient } from '@ceramicnetwork/http-client';
import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking';
import { DIDSession } from '@glazed/did-session';
import { getCurrentAccount } from './snapUtils';
import { DID } from 'dids';
import { SnapProvider } from '@metamask/snap-types';

const ceramicDID = { did: undefined } as { did: DID | undefined };

export const aliases = {
  definitions: {
    StoredCredentials:
      'kjzl6cwe1jw148ulgnabbg1vfx1slceuknt57y3gevnf35wgf4e6b15ypqj9ozv',
  },
  schemas: {
    StoredCredentials:
      'ceramic://k3y52l7qbv1frxk5wjk8vyexuuev6og9eb7bgrh5xtlepuumjtz7fjf1kuzgmpx4w',
  },
  tiles: {},
};

export async function authenticateWithEthereum(
  wallet: SnapProvider
): Promise<DID> {
  if (ceramicDID.did) return ceramicDID.did;
  const account = await getCurrentAccount(wallet);
  if (!account) throw Error('User denied error');
  const authProvider = new EthereumAuthProvider(wallet, account);

  const session = new DIDSession({ authProvider });
  typeof window;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
  window.location = {} as any;
  window.location.hostname = 'ssi-snap';

  const did = await session.authorize({ domain: 'ssi-snap' });
  ceramicDID.did = did;
  return did;
}

export async function getCeramic(wallet: SnapProvider): Promise<CeramicClient> {
  const ceramic = new CeramicClient('https://ceramic-clay.3boxlabs.com');
  const did = await authenticateWithEthereum(wallet);
  await ceramic.setDID(did);
  return ceramic;
}
