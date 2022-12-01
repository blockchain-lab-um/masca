/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Agent, getAgent } from './../veramo/setup';
import {
  IIdentifier,
  MinimalImportableKey,
  VerifiablePresentation,
  W3CVerifiableCredential,
} from '@veramo/core';
import { getCurrentDid } from './didUtils';
import { getPublicKey, snapConfirm } from './snapUtils';
import { SnapProvider } from '@metamask/snap-types';
import { AvailableVCStores, SupportedProofFormats } from '../constants/index';
import { ApiParams } from '../interfaces';
import { snapGetKeysFromAddress } from './keyPair';
import { BIP44CoinTypeNode } from '@metamask/key-tree';
import { IDataManagerSaveResult } from '@blockchain-lab-um/veramo-vc-manager';

export async function veramoSaveVC(args: {
  wallet: SnapProvider;
  verifiableCredential: W3CVerifiableCredential;
  store: AvailableVCStores | [AvailableVCStores];
}): Promise<IDataManagerSaveResult[]> {
  const { wallet, store, verifiableCredential } = args;
  const agent = await getAgent(wallet);
  const res = await agent.save({
    data: verifiableCredential,
    options: { store },
  });
  return res;
}

export interface QueryVCSResult {
  data: W3CVerifiableCredential;
  metadata: {
    id: string;
    store?: string;
  };
}

type Filter = {
  type: string;
  filter: unknown;
};

export async function veramoClearVCs(args: {
  wallet: SnapProvider;
  store?: [AvailableVCStores];
  filter?: Filter;
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

type QueryOptions = {
  store?: string | string[];
  returnStore?: boolean;
};

export async function veramoQueryVCs(args: {
  wallet: SnapProvider;
  options: QueryOptions;
  filter?: Filter;
}): Promise<QueryVCSResult[]> {
  const { wallet, options, filter } = args;
  const agent = await getAgent(wallet);
  const result = (await agent.query({
    filter,
    options,
  })) as QueryVCSResult[];
  return result;
}

type VCMetaData = {
  id: string;
  metadata?: {
    store?: AvailableVCStores;
  };
};

type CreateVPRequestParams = {
  vcs: VCMetaData[];

  proofFormat: SupportedProofFormats;
  proofOptions?: {
    type?: string;
    domain?: string;
    challenge?: string;
  };
};
export async function veramoCreateVP(
  params: ApiParams,
  createVPParams: CreateVPRequestParams
): Promise<VerifiablePresentation | null> {
  const vcsMetadata = createVPParams.vcs;
  //const store = createVPParams.vcs[0].metadata?.store;
  const domain = createVPParams.proofOptions?.domain;
  const challenge = createVPParams.proofOptions?.challenge;
  const proofFormat = createVPParams.proofFormat;

  const { state, wallet, account } = params;
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
    })) as QueryVCSResult[];
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
