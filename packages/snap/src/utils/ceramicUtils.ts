import { CeramicClient } from '@ceramicnetwork/http-client';
import { DIDSession } from 'did-session';
import { getCurrentAccount, getCurrentNetwork } from './snapUtils';
import { DID } from 'dids';
import { SnapsGlobalObject } from '@metamask/snaps-utils';
import { EthereumWebAuth } from '@didtools/pkh-ethereum';
import { AccountId } from 'caip';

const ceramicDID = { did: undefined } as { did: DID | undefined };

export const aliases = {
  definitions: {
    StoredCredentials:
      'kjzl6cwe1jw14a05nhefxjqb74krvxgyzdaje4jnrcaie48vw31pwxxoa7qw5z9',
  },
  schemas: {
    StoredCredentials:
      'ceramic://k3y52l7qbv1frxl7mazhftozd9tpwugrwafoqiyuuludx7s42u7crnzc4jh9ddrls',
  },
  tiles: {},
};

export async function authenticateWithEthereum(
  snap: SnapsGlobalObject
): Promise<DID> {
  if (ceramicDID.did) return ceramicDID.did;
  const account = await getCurrentAccount(snap);
  if (!account) throw Error('User denied error');
  const ethChainId = await getCurrentNetwork(snap);
  const chainId = `eip155:${ethChainId}`;

  const accountId = new AccountId({
    address: account,
    chainId,
  });

  typeof window;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
  window.location = {} as any;
  window.location.hostname = 'ssi-snap';

  const authMethod = await EthereumWebAuth.getAuthMethod(ethereum, accountId);
  const session = await DIDSession.authorize(authMethod, {
    resources: [`ceramic://*`],
  });
  ceramicDID.did = session.did;
  return session.did;
}

export async function getCeramic(
  snap: SnapsGlobalObject
): Promise<CeramicClient> {
  const ceramic = new CeramicClient('https://ceramic-clay.3boxlabs.com');
  const did = await authenticateWithEthereum(snap);
  await ceramic.setDID(did);
  return ceramic;
}
