import { CeramicClient } from '@ceramicnetwork/http-client';
import { EthereumWebAuth } from '@didtools/pkh-ethereum';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { AccountId } from 'caip';
import { DIDSession } from 'did-session';
import { DID } from 'dids';
import { SSISnapState } from 'src/interfaces';

import { getCurrentAccount, getCurrentNetwork } from './snapUtils';

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
  ethereum: MetaMaskInpageProvider,
  state: SSISnapState
): Promise<DID> {
  if (ceramicDID.did) return ceramicDID.did;
  const account = getCurrentAccount(state);
  const ethChainId = await getCurrentNetwork(ethereum);
  const chainId = `eip155:${ethChainId}`;

  const accountId = new AccountId({
    address: account,
    chainId,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  typeof window;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
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
  ethereum: MetaMaskInpageProvider,
  state: SSISnapState
): Promise<CeramicClient> {
  const ceramic = new CeramicClient('https://ceramic-clay.3boxlabs.com');
  const did = await authenticateWithEthereum(ethereum, state);
  await ceramic.setDID(did);
  return ceramic;
}
