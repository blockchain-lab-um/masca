import type {
  AvailableMethods,
  AvailableVCStores,
  MascaState,
} from '@blockchain-lab-um/masca-types';
import { BIP44CoinTypeNode } from '@metamask/key-tree';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';
import type { IIdentifier } from '@veramo/core';
import type { DIDResolutionResult } from 'did-resolver';

import { getAgent } from '../veramo/setup';
import { snapGetKeysFromAddress } from './keyPair';
import { getCurrentNetwork } from './snapUtils';
import { updateSnapState } from './stateUtils';

export async function changeCurrentVCStore(params: {
  snap: SnapsGlobalObject;
  state: MascaState;
  account: string;
  didStore: AvailableVCStores;
  value: boolean;
}): Promise<void> {
  const { snap, state, account, didStore, value } = params;
  state.accountState[account].accountConfig.ssi.vcStore[didStore] = value;
  await updateSnapState(snap, state);
}

export async function getCurrentDidIdentifier(params: {
  ethereum: MetaMaskInpageProvider;
  state: MascaState;
  snap: SnapsGlobalObject;
  account: string;
  bip44CoinTypeNode: BIP44CoinTypeNode;
}): Promise<IIdentifier> {
  const { ethereum, snap, state, account, bip44CoinTypeNode } = params;
  const method = state.accountState[account].accountConfig.ssi.didMethod;
  const agent = await getAgent(snap, ethereum);
  switch (method) {
    case 'did:pkh':
    case 'did:ethr': {
      const chainId = await getCurrentNetwork(ethereum);
      const identifier: IIdentifier = {
        provider: method,
        did:
          method === 'did:ethr'
            ? `did:ethr:${chainId}:${state.currentAccount}`
            : `did:pkh:eip155:${chainId}:${state.currentAccount}`,
        keys: [],
        services: [],
      };
      return identifier;
    }
    case 'did:key:jwk_jcs-pub':
    case 'did:key':
    case 'did:jwk': {
      const res = await snapGetKeysFromAddress({
        bip44CoinTypeNode,
        account,
        snap,
        state,
      });

      if (!res) throw new Error('Failed to get keys');

      const identifier: IIdentifier = await agent.didManagerCreate({
        provider: method === 'did:key:jwk_jcs-pub' ? 'did:key' : method,
        kms: 'snap',
        options: {
          privateKeyHex: res.privateKey.slice(2),
          keyType: method === 'did:key:jwk_jcs-pub' ? 'Secp256r1' : 'Secp256k1',
          ...(method === 'did:key:jwk_jcs-pub' && { type: 'ebsi' }),
        },
      });

      if (!identifier?.did) throw new Error('Failed to create identifier');
      return identifier;
    }
    default:
      throw new Error('Unsupported DID method');
  }
}

export async function changeCurrentMethod(params: {
  snap: SnapsGlobalObject;
  ethereum: MetaMaskInpageProvider;
  state: MascaState;
  account: string;
  bip44CoinTypeNode: BIP44CoinTypeNode;
  didMethod: AvailableMethods;
}): Promise<string> {
  const { snap, ethereum, state, account, didMethod, bip44CoinTypeNode } =
    params;
  state.accountState[account].accountConfig.ssi.didMethod = didMethod;
  await updateSnapState(snap, state);
  const identifier = await getCurrentDidIdentifier({
    ethereum,
    snap,
    state,
    account,
    bip44CoinTypeNode,
  });
  return identifier.did;
}

export async function resolveDid(params: {
  did: string;
  snap: SnapsGlobalObject;
  ethereum: MetaMaskInpageProvider;
}): Promise<DIDResolutionResult> {
  const { did, snap, ethereum } = params;
  const agent = await getAgent(snap, ethereum);
  const didResolution = await agent.resolveDid({ didUrl: did });
  return didResolution;
}
