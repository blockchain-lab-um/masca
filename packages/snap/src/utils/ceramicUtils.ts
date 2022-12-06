import { CeramicClient } from '@ceramicnetwork/http-client';
import { DIDSession } from 'did-session';
import { getCurrentAccount } from './snapUtils';
import { DID } from 'dids';
import { SnapProvider } from '@metamask/snap-types';
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum';

const ceramicDID = { did: undefined } as { did: DID | undefined };

export const aliases = {
  definitions: {
    StoredCredentials:
      'kjzl6cwe1jw1475uoed3zn1yq28pnh6pqqq611y21qwhweln9p8er7g09crnwqa',
  },
  schemas: {
    StoredCredentials:
      'ceramic://k3y52l7qbv1fryllp4tpkqpkbg3ndpni8i4czh2gl8hxjozo5uxduknnd9ebma6m8',
  },
  tiles: {},
};

export async function authenticateWithEthereum(
  wallet: SnapProvider
): Promise<DID> {
  if (ceramicDID.did) return ceramicDID.did;
  const account = await getCurrentAccount(wallet);
  if (!account) throw Error('User denied error');
  const accountId = await getAccountId(wallet, account);

  const authMethod = await EthereumWebAuth.getAuthMethod(wallet, accountId);

  typeof window;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
  window.location = {} as any;
  window.location.hostname = 'ssi-snap';

  const session = await DIDSession.authorize(authMethod, {
    resources: [`ceramic://*`],
  });
  ceramicDID.did = session.did;
  return session.did;
}

export async function getCeramic(wallet: SnapProvider): Promise<CeramicClient> {
  const ceramic = new CeramicClient('https://ceramic-clay.3boxlabs.com');
  const did = await authenticateWithEthereum(wallet);
  await ceramic.setDID(did);
  return ceramic;
}
