import {
  AvailableMethods,
  AvailableVCStores,
} from '@blockchain-lab-um/ssi-snap-types';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsGlobalObject } from '@metamask/snaps-types';
import { DIDResolutionResult } from 'did-resolver';

import {
  getDidEbsiKeyIdentifier,
  getDidKeyIdentifier,
} from '../did/key/keyDidUtils';
import { getDidPkhIdentifier } from '../did/pkh/pkhDidUtils';
import { SSISnapState } from '../interfaces';
import { getAgent } from '../veramo/setup';
import { getCurrentNetwork } from './snapUtils';
import { updateSnapState } from './stateUtils';

export async function changeCurrentVCStore(
  snap: SnapsGlobalObject,
  state: SSISnapState,
  account: string,
  didStore: AvailableVCStores,
  value: boolean
): Promise<void> {
  // eslint-disable-next-line no-param-reassign
  state.accountState[account].accountConfig.ssi.vcStore[didStore] = value;
  await updateSnapState(snap, state);
}

export async function getCurrentDid(
  ethereum: MetaMaskInpageProvider,
  state: SSISnapState,
  account: string
): Promise<string> {
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
  if (method === 'did:pkh') {
    const didUrl = await getDidPkhIdentifier(ethereum, account);
    return `did:pkh:${didUrl}`;
  }
  // if (method === "did:key:ebsi") {
  // }
  return '';
}

export async function changeCurrentMethod(
  snap: SnapsGlobalObject,
  ethereum: MetaMaskInpageProvider,
  state: SSISnapState,
  account: string,
  didMethod: AvailableMethods
): Promise<string> {
  // eslint-disable-next-line no-param-reassign
  state.accountState[account].accountConfig.ssi.didMethod = didMethod;
  await updateSnapState(snap, state);
  const did = await getCurrentDid(ethereum, state, account);
  return did;
}

export async function resolveDid(
  did: string,
  snap: SnapsGlobalObject,
  ethereum: MetaMaskInpageProvider
): Promise<DIDResolutionResult> {
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
