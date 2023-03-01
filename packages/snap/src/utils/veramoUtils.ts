import { MetaMaskInpageProvider } from '@metamask/providers';
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
import { SnapsGlobalObject } from '@metamask/snaps-types';
import { BIP44CoinTypeNode } from '@metamask/key-tree';
import {
  IDataManagerSaveResult,
  Filter,
} from '@blockchain-lab-um/veramo-vc-manager';
import { Agent, getAgent } from '../veramo/setup';
import { getCurrentDid } from './didUtils';
import { getPublicKey, snapConfirm } from './snapUtils';
import { ApiParams } from '../interfaces';
import { snapGetKeysFromAddress } from './keyPair';

export async function veramoSaveVC(args: {
  snap: SnapsGlobalObject;
  ethereum: MetaMaskInpageProvider;
  verifiableCredential: W3CVerifiableCredential;
  store: AvailableVCStores | AvailableVCStores[];
}): Promise<IDataManagerSaveResult[]> {
  const { snap, ethereum, store, verifiableCredential } = args;
  const agent = await getAgent(snap, ethereum);
  const res = await agent.save({
    data: verifiableCredential,
    options: { store },
  });
  return res;
}

export const veramoImportMetaMaskAccount = async (
  params: ApiParams,
  agent: Agent
): Promise<IIdentifier> => {
  const { state, snap, ethereum, account, bip44CoinTypeNode } = params;
  const method = state.accountState[account].accountConfig.ssi.didMethod;
  const did = await getCurrentDid(ethereum, state, account);

  const res = await snapGetKeysFromAddress(
    bip44CoinTypeNode as BIP44CoinTypeNode,
    state,
    account,
    snap
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

export async function veramoClearVCs(args: {
  snap: SnapsGlobalObject;
  ethereum: MetaMaskInpageProvider;
  store?: AvailableVCStores | AvailableVCStores[];
  filter?: Filter; // TODO: Seperate type from datamanager (currently vcmanager)?
}): Promise<boolean[]> {
  const { snap, ethereum, store, filter } = args;
  let options;
  if (store) options = { store };
  const agent = await getAgent(snap, ethereum);
  const result = await agent.clear({
    filter,
    options,
  });
  return result;
}

export async function veramoDeleteVC(args: {
  snap: SnapsGlobalObject;
  ethereum: MetaMaskInpageProvider;
  id: string;
  store?: AvailableVCStores | AvailableVCStores[];
}): Promise<boolean[]> {
  const { snap, ethereum, store, id } = args;
  const agent = await getAgent(snap, ethereum);
  let options;
  if (store) options = { store };
  const result = await agent.delete({
    id,
    options,
  });
  return result;
}

export async function veramoQueryVCs(args: {
  snap: SnapsGlobalObject;
  ethereum: MetaMaskInpageProvider;
  options: QueryVCsOptions;
  filter?: Filter;
}): Promise<QueryVCsRequestResult[]> {
  const { snap, ethereum, options, filter } = args;
  const agent = await getAgent(snap, ethereum);
  const result = (await agent.query({
    filter,
    options,
  })) as QueryVCsRequestResult[];

  let resultUnique = result;
  if (options.returnStore) {
    resultUnique = result.reduce((acc, item) => {
      const existingItem = acc.find((i) => i.metadata.id === item.metadata.id);
      if (existingItem) {
        if (existingItem.metadata.store && item.metadata.store) {
          if (typeof existingItem.metadata.store === 'string') {
            existingItem.metadata.store = [
              existingItem.metadata.store,
              item.metadata.store?.toString(),
            ];
          } else if (Array.isArray(existingItem.metadata.store)) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            existingItem.metadata.store.push(item.metadata.store?.toString());
          }
          return acc;
        }
      }
      return [...acc, item];
    }, [] as QueryVCsRequestResult[]);
  }
  return resultUnique;
}

export async function veramoCreateVP(
  params: ApiParams,
  createVPParams: CreateVPRequestParams
): Promise<VerifiablePresentation | null> {
  const vcsMetadata = createVPParams.vcs;
  const domain = createVPParams.proofOptions?.domain;
  const challenge = createVPParams.proofOptions?.challenge;
  const proofFormat = createVPParams.proofFormat
    ? createVPParams.proofFormat
    : 'jwt';

  const { state, snap, ethereum } = params;
  // Get Veramo agent
  const agent = await getAgent(snap, ethereum);
  // GET DID
  const identifier = await veramoImportMetaMaskAccount(params, agent);

  const vcs: W3CVerifiableCredential[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const vcMetadata of vcsMetadata) {
    // eslint-disable-next-line no-await-in-loop
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
  if (config.dApp.disablePopups || snapConfirm(snap, promptObj)) {
    const vp = await agent.createVerifiablePresentation({
      presentation: {
        holder: identifier.did,
        type: ['VerifiablePresentation', 'Custom'],
        verifiableCredential: vcs,
      },
      proofFormat,
      domain,
      challenge,
    });
    return vp;
  }
  return null;
}
