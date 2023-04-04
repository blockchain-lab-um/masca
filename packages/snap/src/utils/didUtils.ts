import {
  AvailableMethods,
  AvailableVCStores,
} from '@blockchain-lab-um/masca-types';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsGlobalObject } from '@metamask/snaps-types';
import { DIDResolutionResult } from 'did-resolver';

import {
  getDidEbsiKeyIdentifier,
  getDidKeyIdentifier,
} from '../did/key/keyDidUtils';
import { getDidPkhIdentifier } from '../did/pkh/pkhDidUtils';
import { MascaState } from '../interfaces';
import { getAgent } from '../veramo/setup';
import { getDidEbsiIdentifier } from './ebsiUtils';
import { getCurrentNetwork } from './snapUtils';
import { updateSnapState } from './stateUtils';

export async function changeCurrentVCStore(params: {
  snap: SnapsGlobalObject;
  state: MascaState;
  account: string;
  didStore: AvailableVCStores;
  value: boolean;
}): Promise<void> {
  // eslint-disable-next-line no-param-reassign
  const { snap, state, account, didStore, value } = params;
  state.accountState[account].accountConfig.ssi.vcStore[didStore] = value;
  await updateSnapState(snap, state);
}

export async function getCurrentDid(params: {
  state: MascaState;
  snap: SnapsGlobalObject;
  account: string;
  ethereum: MetaMaskInpageProvider;
}): Promise<string> {
  const { state, snap, account, ethereum } = params;
  const method = state.accountState[account].accountConfig.ssi.didMethod;
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
  if (method === 'did:pkh') {
    const didUrl = await getDidPkhIdentifier(ethereum, account);
    return `did:pkh:${didUrl}`;
  }

  return '';
}

export async function changeCurrentMethod(params: {
  snap: SnapsGlobalObject;
  ethereum: MetaMaskInpageProvider;
  state: MascaState;
  account: string;
  didMethod: AvailableMethods;
}): Promise<string> {
  const { snap, ethereum, state, account, didMethod } = params;
  // eslint-disable-next-line no-param-reassign
  state.accountState[account].accountConfig.ssi.didMethod = didMethod;
  await updateSnapState(snap, state);
  const did = await getCurrentDid({ state, snap, account, ethereum });
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
