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
import { getDidJwkIdentifier } from '../did/jwk/jwkDidUtils';
import { ApiParams, SSISnapState } from '../interfaces';
import { getAgent } from '../veramo/setup';
import { getDidEbsiIdentifier } from './ebsiUtils';
import { getAddressKeyDeriver, snapGetKeysFromAddress } from './keyPair';
import { getCurrentNetwork } from './snapUtils';
import { getSnapState, updateSnapState } from './stateUtils';

export async function changeCurrentVCStore(params: {
  snap: SnapsGlobalObject;
  state: SSISnapState;
  account: string;
  didStore: AvailableVCStores;
  value: boolean;
}): Promise<void> {
  // eslint-disable-next-line no-param-reassign
  const { snap, state, account, didStore, value } = params;
  state.accountState[account].accountConfig.ssi.vcStore[didStore] = value;
  await updateSnapState(snap, state);
}

export async function getCurrentDid(
  ethereum: MetaMaskInpageProvider,
  snap: SnapsGlobalObject,
  account: string,
  origin: string
): Promise<string> {
  const state = await getSnapState(snap);
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
  /* if (method === 'did:pkh') {
    const agent = await getAgent(snap, ethereum);
    const didUrl = await getDidPkhIdentifier(ethereum, account);
    return `did:pkh:${didUrl}`;
  } */
  if (method === 'did:jwk' || method === 'did:pkh') {
    const agent = await getAgent(snap, ethereum);
    const bip44CoinTypeNode = await getAddressKeyDeriver({
      state,
      snap,
      ethereum,
      account,
      origin,
    } as ApiParams);
    const res = await snapGetKeysFromAddress(
      bip44CoinTypeNode,
      state,
      account,
      snap
    );
    if (!res) throw new Error('Failed to get keys');
    const identifier = await agent.didManagerCreate({
      provider: method,
      kms: 'snap',
      options: {
        privateKeyHex: res.privateKey.split('0x')[1],
        keyType: 'Secp256k1',
      },
    });
    return identifier.did;
  }
  return '';
}

export async function changeCurrentMethod(
  snap: SnapsGlobalObject,
  ethereum: MetaMaskInpageProvider,
  state: SSISnapState,
  account: string,
  didMethod: AvailableMethods,
  origin: string
): Promise<string> {
  // eslint-disable-next-line no-param-reassign
  state.accountState[account].accountConfig.ssi.didMethod = didMethod;
  await updateSnapState(snap, state);
  const did = await getCurrentDid(ethereum, snap, account, origin);
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
