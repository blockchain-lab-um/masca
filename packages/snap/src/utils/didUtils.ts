import type {
  AvailableMethods,
  AvailableVCStores,
} from '@blockchain-lab-um/masca-types';
import { BIP44CoinTypeNode } from '@metamask/key-tree';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';
import type { IIdentifier } from '@veramo/core';
import type { DIDResolutionResult } from 'did-resolver';
import elliptic from 'elliptic';

import type { MascaState } from '../interfaces';
import { getAgent } from '../veramo/setup';
import { snapGetKeysFromAddress } from './keyPair';
import { getCurrentNetwork } from './snapUtils';
import { updateSnapState } from './stateUtils';

const { ec: EC } = elliptic;

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

export async function getCurrentDid(params: {
  ethereum: MetaMaskInpageProvider;
  state: MascaState;
  snap: SnapsGlobalObject;
  account: string;
  bip44CoinTypeNode: BIP44CoinTypeNode;
}): Promise<string> {
  const { ethereum, snap, state, account, bip44CoinTypeNode } = params;

  const method = state.accountState[account].accountConfig.ssi.didMethod;

  switch (method) {
    case 'did:ethr': {
      const CHAIN_ID = await getCurrentNetwork(ethereum);
      const ctx = new EC('secp256k1');
      const ecPublicKey = ctx.keyFromPublic(
        state.accountState[account].publicKey.slice(2),
        'hex'
      );
      const compactPublicKey = `0x${ecPublicKey.getPublic(true, 'hex')}`;

      return `did:ethr:${CHAIN_ID}:${compactPublicKey}`;
    }
    case 'did:key:ebsi':
    case 'did:key':
    case 'did:pkh':
    case 'did:jwk': {
      const agent = await getAgent(snap, ethereum);
      const res = await snapGetKeysFromAddress(
        bip44CoinTypeNode,
        state,
        account,
        snap
      );

      if (!res) throw new Error('Failed to get keys');

      const identifier: IIdentifier = await agent.didManagerCreate({
        provider: method === 'did:key:ebsi' ? 'did:key' : method,
        kms: 'snap',
        options: {
          privateKeyHex: res.privateKey.slice(2),
          keyType: 'Secp256k1',
          ...(method === 'did:key:ebsi' && { type: 'ebsi' }),
        },
      });

      if (!identifier?.did) throw new Error('Failed to create identifier');
      return identifier.did;
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
  const did = await getCurrentDid({
    ethereum,
    snap,
    state,
    account,
    bip44CoinTypeNode,
  });
  return did;
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
