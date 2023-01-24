import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsGlobalObject } from '@metamask/snaps-types';
import {
  AvailableMethods,
  AvailableVCStores,
} from '@blockchain-lab-um/ssi-snap-types';
import { DIDResolutionResult } from 'did-resolver';
import { getDidKeyIdentifier } from '../did/key/keyDidUtils';
import { SSISnapState } from '../interfaces';
import { getCurrentNetwork } from './snapUtils';
import { updateSnapState } from './stateUtils';
import { getDidPkhIdentifier } from '../did/pkh/pkhDidUtils';

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
  if (method === 'did:pkh') {
    const didUrl = await getDidPkhIdentifier(ethereum, account);
    return `did:pkh:${didUrl}`;
  }
  return '';
}

export async function changeCurrentMethod(
  snap: SnapsGlobalObject,
  ethereum: MetaMaskInpageProvider,
  state: SSISnapState,
  account: string,
  didMethod: AvailableMethods
): Promise<string> {
  if (state.accountState[account].accountConfig.ssi.didMethod !== didMethod) {
    // eslint-disable-next-line no-param-reassign
    state.accountState[account].accountConfig.ssi.didMethod = didMethod;
    await updateSnapState(snap, state);
    const did = await getCurrentDid(ethereum, state, account);
    return did;
  }
  return '';
}

export async function resolveDid(did: string): Promise<DIDResolutionResult> {
  const response = await fetch(
    `https://dev.uniresolver.io/1.0/identifiers/${did}`
  );
  const data = (await response.json()) as DIDResolutionResult;
  return data;
}
