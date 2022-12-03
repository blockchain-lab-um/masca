/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Agent, getAgent } from './../veramo/setup';
import {
  AvailableVCStores,
  CreateVPRequestParams,
  QueryVCsOptions,
  QueryVCsRequestResult,
} from '@blockchain-lab-um/ssi-snap-types';
import {
  IIdentifier,
  MinimalImportableKey,
  VerifiablePresentation,
  W3CVerifiableCredential,
} from '@veramo/core';
import { getCurrentDid } from './didUtils';
import { getPublicKey, snapConfirm } from './snapUtils';
import { SnapProvider } from '@metamask/snap-types';
import { ApiParams } from '../interfaces';
import { snapGetKeysFromAddress } from './keyPair';
import { BIP44CoinTypeNode } from '@metamask/key-tree';
import { IDataManagerSaveResult } from '@blockchain-lab-um/veramo-vc-manager';
import { Filter } from '@blockchain-lab-um/veramo-vc-manager';

export async function veramoSaveVC(args: {
  wallet: SnapProvider;
  verifiableCredential: W3CVerifiableCredential;
  store: AvailableVCStores | AvailableVCStores[];
}): Promise<IDataManagerSaveResult[]> {
  const { wallet, store, verifiableCredential } = args;
  const agent = await getAgent(wallet);
  const res = await agent.save({
    data: verifiableCredential,
    options: { store },
  });
  return res;
}

export async function veramoClearVCs(args: {
  wallet: SnapProvider;
  store?: AvailableVCStores | AvailableVCStores[];
  filter?: Filter; // TODO: Seperate type from datamanager (currently vcmanager)?
}): Promise<boolean[]> {
  const { wallet, store, filter } = args;
  let options = undefined;
  if (store) options = { store };
  const agent = await getAgent(wallet);
  const result = await agent.clear({
    filter,
    options,
  });
  return result;
}

export async function veramoDeleteVC(args: {
  wallet: SnapProvider;
  id: string;
  store?: [AvailableVCStores];
}): Promise<boolean[]> {
  const { wallet, store, id } = args;
  const agent = await getAgent(wallet);
  let options = undefined;
  if (store) options = { store };
  const result = await agent.delete({
    id: id,
    options,
  });
  return result;
}

export async function veramoQueryVCs(args: {
  wallet: SnapProvider;
  options: QueryVCsOptions;
  filter?: Filter;
}): Promise<QueryVCsRequestResult[]> {
  const { wallet, options, filter } = args;
  const agent = await getAgent(wallet);
  const result = (await agent.query({
    filter,
    options,
  })) as QueryVCsRequestResult[];
  return result;
}

export async function veramoCreateVP(
  params: ApiParams,
  createVPParams: CreateVPRequestParams
): Promise<VerifiablePresentation | null> {
  const vcsMetadata = createVPParams.vcs;
  //const store = createVPParams.vcs[0].metadata?.store;
  const domain = createVPParams.proofOptions?.domain;
  const challenge = createVPParams.proofOptions?.challenge;
  const proofFormat = createVPParams.proofFormat
    ? createVPParams.proofFormat
    : 'jwt'; // TODO: Do we want to set default to jwt?

  const { state, wallet } = params;
  //Get Veramo agent
  const agent = await getAgent(wallet);
  //GET DID
  const identifier = await veramoImportMetaMaskAccount(params, agent);

  const vcs: W3CVerifiableCredential[] = [];

  for (const vcMetadata of vcsMetadata) {
    const vcObj = (await agent.query({
      filter: {
        type: 'id',
        filter: vcMetadata.id,
      },
      options: { store: vcMetadata.metadata?.store },
    })) as QueryVCsRequestResult[];
    if (vcObj.length > 0) {
      const vc: W3CVerifiableCredential = vcObj[0].data;
      vcs.push(vc);
    }
  }

  if (vcs.length === 0) return null;
  const config = state.snapConfig;
  const promptObj = {
    prompt: 'Alert',
    description: 'Do you wish to create a VP from the following VC?',
    textAreaContent: 'Multiple VCs',
  };
  if (config.dApp.disablePopups || (await snapConfirm(wallet, promptObj))) {
    const vp = await agent.createVerifiablePresentation({
      presentation: {
        holder: identifier.did,
        type: ['VerifiablePresentation', 'Custom'],
        verifiableCredential: vcs,
      },
      proofFormat: proofFormat,
      domain: domain,
      challenge: challenge,
    });
    return vp;
  }
  return null;
}

export const veramoImportMetaMaskAccount = async (
  params: ApiParams,
  agent: Agent
): Promise<IIdentifier> => {
  const { state, wallet, account, bip44CoinTypeNode } = params;
  const method = state.accountState[account].accountConfig.ssi.didMethod;
  const did = await getCurrentDid(wallet, state, account);

  const res = await snapGetKeysFromAddress(
    bip44CoinTypeNode as BIP44CoinTypeNode,
    state,
    account,
    wallet
  );
  if (!res) throw new Error('Failed to get keys');

  const publicKey = await getPublicKey(params);
  const controllerKeyId = `metamask-${account}`;

  const identifier = await agent.didManagerImport({
    did,
    provider: method,
    controllerKeyId,
    keys: [
      {
        kid: controllerKeyId,
        type: 'Secp256k1',
        kms: 'snap',
        privateKeyHex: res.privateKey.split('0x')[1],
        publicKeyHex: publicKey.split('0x')[1],
      } as MinimalImportableKey,
    ],
  });
  return identifier;
};
