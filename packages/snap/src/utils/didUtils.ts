import {
  AvailableMethods,
  AvailableVCStores,
} from '@blockchain-lab-um/masca-types';
import { BIP44CoinTypeNode } from '@metamask/key-tree';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsGlobalObject } from '@metamask/snaps-types';
import { IIdentifier } from '@veramo/core';
import { DIDResolutionResult } from 'did-resolver';

import { getDidJwkIdentifier } from '../did/jwk/jwkDidUtils';
import {
  getDidEbsiKeyIdentifier,
  getDidKeyIdentifier,
} from '../did/key/keyDidUtils';
import { MascaState } from '../interfaces';
import { getAgent } from '../veramo/setup';
import { getDidEbsiIdentifier } from './ebsiUtils';
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

export async function getCurrentDid(params: {
  ethereum: MetaMaskInpageProvider;
  state: MascaState;
  snap: SnapsGlobalObject;
  account: string;
  bip44CoinTypeNode: BIP44CoinTypeNode;
}): Promise<string> {
  const { ethereum, snap, state, account, bip44CoinTypeNode } = params;

  const method = state.accountState[account].accountConfig.ssi.didMethod;

  // TODO: Use switch statement
  if (method === 'did:ethr') {
    const CHAIN_ID = await getCurrentNetwork(ethereum);
    return `did:ethr:${CHAIN_ID}:${account}`;
  }
  if (method === 'did:key') {
    const didUrl = getDidKeyIdentifier(state, account);
    return `did:key:${didUrl}`;
  }
  if (method === 'did:key:ebsi') {
    const didUrl = getDidEbsiKeyIdentifier(state, account);
    return `did:key:${didUrl}`;
  }
  if (method === 'did:ebsi') {
    // TODO: handle ebsi bearer token workflow
    const bearer = '';
    const didUrl = await getDidEbsiIdentifier({
      state,
      snap,
      account,
      args: {
        provider: method,
        kms: 'web3',
        options: { bearer },
      },
    });
    return `did:ebsi:${didUrl}`;
  }
  if (method === 'did:jwk') {
    const didUrl = await getDidJwkIdentifier(state, account);
    return `did:jwk:${didUrl}`;
  }
  // TODO: handle did:jwk when veramo supports it
  if (method === 'did:pkh') {
    const agent = await getAgent(snap, ethereum);

    const res = await snapGetKeysFromAddress(
      bip44CoinTypeNode,
      state,
      account,
      snap
    );

    if (!res) throw new Error('Failed to get keys');

    const identifier: IIdentifier = await agent.didManagerCreate({
      provider: method,
      kms: 'snap',
      options: {
        privateKeyHex: res.privateKey.split('0x')[1],
        keyType: 'Secp256k1',
      },
    });

    if (!identifier?.did) throw new Error('Failed to create identifier');
    return identifier.did;
  }
  return ''; // TODO: Throw error
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
  if (did.startsWith('did:key:zBhB') || did.startsWith('did:key:z2dm')) {
    const agent = await getAgent(snap, ethereum);
    const didResolution = await agent.resolveDid({ didUrl: did });
    return didResolution;
  }
  const response = await fetch(
    `https://dev.uniresolver.io/1.0/identifiers/${did}`
  );
  const data = (await response.json()) as DIDResolutionResult;
  return data;
}
