import { CeramicClient } from '@ceramicnetwork/http-client';
import { EthereumNodeAuth, getAccountId } from '@didtools/pkh-ethereum';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsGlobalObject } from '@metamask/snaps-types';
import { DIDSession } from 'did-session';
import { DID } from 'dids';
import { Wallet } from 'ethers';
import { MascaState } from 'src/interfaces';

import { getAddressKeyDeriver, snapGetKeysFromAddress } from './keyPair';
import { getCurrentAccount } from './snapUtils';

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

class CustomProvider {
  constructor(
    private readonly wallet: Wallet,
    private readonly metamask: MetaMaskInpageProvider
  ) {
    this.wallet = wallet;
    this.metamask = metamask;
  }

  async request(args: { method: string; params: Array<string> }) {
    const { method, params } = args;

    if (method === 'personal_sign') {
      // First parameter is the message to sign, second parameter is the address
      const [message] = params;
      return this.wallet.signMessage(message);
    }

    if (method === 'eth_chainId') {
      return this.metamask.request(args);
    }

    throw new Error('Unsupported method');
  }
}

async function authenticateWithEthers(params: {
  ethereum: MetaMaskInpageProvider;
  snap: SnapsGlobalObject;
  state: MascaState;
}) {
  if (ceramicDID.did) return ceramicDID.did;

  const { ethereum, snap, state } = params;

  const account = getCurrentAccount(state);

  const bip44CoinTypeNode = await getAddressKeyDeriver({
    state,
    snap,
    account,
  });

  const res = await snapGetKeysFromAddress(
    bip44CoinTypeNode,
    state,
    account,
    snap
  );

  if (res === null) throw new Error('Could not get keys from address');

  const { privateKey } = res;

  // Ethers is required to sign the DID auth message
  const wallet = new Wallet(privateKey);

  const customProvider = new CustomProvider(wallet, ethereum);

  const accountId = await getAccountId(customProvider, wallet.address);

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  typeof window;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  window.location = {} as any;
  window.location.hostname = 'masca';

  const authMethod = await EthereumNodeAuth.getAuthMethod(
    customProvider,
    accountId,
    'masca'
  );

  const session = await DIDSession.authorize(authMethod, {
    resources: [`ceramic://*`],
  });

  ceramicDID.did = session.did;
  return session.did;
}

export async function getCeramic(
  ethereum: MetaMaskInpageProvider,
  snap: SnapsGlobalObject,
  state: MascaState
): Promise<CeramicClient> {
  const ceramic = new CeramicClient('https://ceramic-clay.3boxlabs.com');

  const did = await authenticateWithEthers({ ethereum, snap, state });

  await ceramic.setDID(did);
  return ceramic;
}
