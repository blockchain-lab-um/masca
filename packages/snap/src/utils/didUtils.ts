import { SnapsGlobalObject } from '@metamask/snaps-utils';
import {
  AvailableMethods,
  AvailableVCStores,
} from '@blockchain-lab-um/ssi-snap-types';
import { getDidKeyIdentifier } from '../did/key/keyDidUtils';
import { SSISnapState } from '../interfaces';
import { getCurrentNetwork } from './snapUtils';
import { updateSnapState } from './stateUtils';
import { getDidPkhIdentifier } from '../did/pkh/pkhDidUtils';
import { DIDResolutionResult } from 'did-resolver';

export async function changeCurrentVCStore(
  snap: SnapsGlobalObject,
  state: SSISnapState,
  account: string,
  didStore: AvailableVCStores,
  value: boolean
): Promise<void> {
  state.accountState[account].accountConfig.ssi.vcStore[didStore] = value;
  await updateSnapState(snap, state);
}

export async function getCurrentDid(
  snap: SnapsGlobalObject,
  state: SSISnapState,
  account: string
): Promise<string> {
  const method = state.accountState[account].accountConfig.ssi.didMethod;
  if (method === 'did:ethr') {
    const chain_id = await getCurrentNetwork(snap);
    return `did:ethr:${chain_id}:${account}`;
  } else if (method === 'did:key') {
    const didUrl = getDidKeyIdentifier(state, account);
    return `did:key:${didUrl}`;
  } else if (method === 'did:pkh') {
    const didUrl = await getDidPkhIdentifier(snap, account);
    return `did:pkh:${didUrl}`;
  } else {
    return '';
  }
}

export async function changeCurrentMethod(
  snap: SnapsGlobalObject,
  state: SSISnapState,
  account: string,
  didMethod: AvailableMethods
): Promise<string> {
  if (state.accountState[account].accountConfig.ssi.didMethod !== didMethod) {
    state.accountState[account].accountConfig.ssi.didMethod = didMethod;
    await updateSnapState(snap, state);
    const did = await getCurrentDid(snap, state, account);
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
