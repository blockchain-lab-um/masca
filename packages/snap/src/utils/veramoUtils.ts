import type {
  AvailableVCStores,
  CreateVCRequestParams,
  CreateVPRequestParams,
  MascaState,
  QueryVCsOptions,
  QueryVCsRequestResult,
  SaveVCRequestResult,
  VerifyDataRequestParams,
} from '@blockchain-lab-um/masca-types';
import type { Filter } from '@blockchain-lab-um/veramo-datamanager';
import { BIP44CoinTypeNode } from '@metamask/key-tree';
import { MetaMaskInpageProvider } from '@metamask/providers';
import type { SnapsGlobalObject } from '@metamask/snaps-types';
import { copyable, divider, heading, panel, text } from '@metamask/snaps-ui';
import type {
  CredentialPayload,
  ICreateVerifiableCredentialArgs,
  IIdentifier,
  IVerifyResult,
  MinimalImportableKey,
  VerifiableCredential,
  VerifiablePresentation,
  W3CVerifiableCredential,
} from '@veramo/core';

import type { ApiParams } from '../interfaces';
import { getAgent, type Agent } from '../veramo/setup';
import { getCurrentDidIdentifier } from './didUtils';
import { snapGetKeysFromAddress } from './keyPair';
import { snapConfirm } from './snapUtils';

export async function veramoSaveVC(args: {
  snap: SnapsGlobalObject;
  ethereum: MetaMaskInpageProvider;
  verifiableCredential: W3CVerifiableCredential;
  store: AvailableVCStores | AvailableVCStores[];
}): Promise<SaveVCRequestResult[]> {
  const { snap, ethereum, store, verifiableCredential } = args;
  const agent = await getAgent(snap, ethereum);
  const result = await agent.save({
    data: verifiableCredential,
    options: { store },
  });

  const vcs = new Map<string, SaveVCRequestResult>();

  for (const vc of result) {
    if (!vc.store) {
      throw new Error('Missing store in VC metadata');
    }

    const existingVC = vcs.get(vc.id);
    if (existingVC) {
      existingVC.store.push(vc.store);
    } else {
      vcs.set(vc.id, {
        id: vc.id,
        store: [vc.store],
      });
    }
  }
  return [...vcs.values()];
}

export async function veramoImportMetaMaskAccount(
  params: {
    snap: SnapsGlobalObject;
    ethereum: MetaMaskInpageProvider;
    state: MascaState;
    account: string;
    did: string;
    bip44CoinTypeNode: BIP44CoinTypeNode;
  },
  agent: Agent
): Promise<IIdentifier> {
  const { snap, bip44CoinTypeNode, did, account, state } = params;
  const method =
    params.state.accountState[params.account].accountConfig.ssi.didMethod;
  const res = await snapGetKeysFromAddress({
    snap,
    bip44CoinTypeNode,
    account,
    state,
  });
  if (!res) throw new Error('Failed to get keys');

  const controllerKeyId = `metamask-${account}`;

  const identifier = await agent.didManagerImport({
    did,
    provider: method,
    controllerKeyId,
    keys: [
      {
        kid: controllerKeyId,
        type: method === 'did:key:jwk_jcs-pub' ? 'Secp256r1' : 'Secp256k1',
        kms: 'snap',
        privateKeyHex: res.privateKey.slice(2),
        publicKeyHex: res.publicKey.slice(2),
      } as MinimalImportableKey,
    ],
  });
  return identifier;
}
export async function veramoClearVCs(args: {
  snap: SnapsGlobalObject;
  ethereum: MetaMaskInpageProvider;
  store?: AvailableVCStores | AvailableVCStores[];
  filter?: Filter; // TODO: Seperate type from datamanager ?
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
  const result = await agent.query({
    filter,
    options,
  });

  const vcs = new Map<string, QueryVCsRequestResult>();

  for (const vc of result) {
    if (options.returnStore && !vc.metadata.store) {
      throw new Error('Missing store in VC metadata');
    }

    const existingVC = vcs.get(vc.metadata.id);
    if (existingVC) {
      if (options.returnStore) {
        existingVC.metadata.store?.push(vc.metadata.store as string);
      }
    } else {
      vcs.set(vc.metadata.id, {
        data: vc.data as VerifiableCredential,
        metadata: {
          id: vc.metadata.id,
          ...(options.returnStore && { store: [vc.metadata.store as string] }),
        },
      });
    }
  }
  return [...vcs.values()];
}

export async function veramoCreateVP(
  params: ApiParams,
  createVPParams: CreateVPRequestParams
): Promise<VerifiablePresentation> {
  const { state, snap, ethereum, account, bip44CoinTypeNode } = params;
  const { vcs } = createVPParams;
  const domain = createVPParams.proofOptions?.domain;
  const challenge = createVPParams.proofOptions?.challenge;
  const proofFormat = createVPParams.proofFormat
    ? createVPParams.proofFormat
    : 'jwt';
  const agent = await getAgent(snap, ethereum);
  const identifier = await getCurrentDidIdentifier({
    snap,
    ethereum,
    state,
    account,
    bip44CoinTypeNode: bip44CoinTypeNode as BIP44CoinTypeNode,
  });
  const importedIdentifier = await veramoImportMetaMaskAccount(
    {
      ...params,
      did: identifier.did,
      bip44CoinTypeNode: bip44CoinTypeNode as BIP44CoinTypeNode,
    },
    agent
  );

  if (vcs.length === 0) {
    throw new Error('VC does not exist');
  }

  const config = state.snapConfig;
  const content = panel([
    heading('Create VP'),
    text('Would you like to create a VP from the following VC(s)?'),
    divider(),
    text(`VC(s):`),
    ...vcs.map((vc) => copyable(JSON.stringify(vc, null, 2))),
  ]);

  if (config.dApp.disablePopups || (await snapConfirm(snap, content))) {
    const vp = await agent.createVerifiablePresentation({
      presentation: {
        holder: importedIdentifier.did,
        type: ['VerifiablePresentation', 'Custom'],
        verifiableCredential: vcs,
      },
      proofFormat,
      domain,
      challenge,
    });
    return vp;
  }

  throw new Error('User rejected create VP request');
}

export async function veramoVerifyData(args: {
  snap: SnapsGlobalObject;
  ethereum: MetaMaskInpageProvider;
  data: VerifyDataRequestParams;
}): Promise<IVerifyResult> {
  try {
    const { snap, ethereum, data } = args;
    const { credential, presentation } = data;

    const agent = await getAgent(snap, ethereum);

    if (credential) {
      return await agent.verifyCredential({
        credential,
      });
    }
    if (presentation) {
      return await agent.verifyPresentation({
        presentation,
      });
    }
    return {
      verified: false,
      error: new Error('No valid credential or presentation.'),
    } as IVerifyResult;
  } catch (error: unknown) {
    return { verified: false, error: error as Error } as IVerifyResult;
  }
}

export async function veramoCreateVC(
  params: ApiParams,
  createVCParams: CreateVCRequestParams
): Promise<VerifiableCredential> {
  const { snap, state, ethereum, account, bip44CoinTypeNode } = params;
  const { minimalUnsignedCredential, proofFormat = 'jwt' } = createVCParams;
  const agent = await getAgent(snap, ethereum);
  const identifier = await getCurrentDidIdentifier({
    snap,
    state,
    ethereum,
    account,
    bip44CoinTypeNode: bip44CoinTypeNode as BIP44CoinTypeNode,
  });
  const importedIdentifier = await veramoImportMetaMaskAccount(
    {
      ...params,
      did: identifier.did,
      bip44CoinTypeNode: bip44CoinTypeNode as BIP44CoinTypeNode,
    },
    agent
  );

  const credentialPayload = minimalUnsignedCredential;
  credentialPayload.issuer = importedIdentifier.did;

  const config = state.snapConfig;

  const createVCArgs: ICreateVerifiableCredentialArgs = {
    credential: credentialPayload as CredentialPayload,
    proofFormat,
    save: false,
  };
  const content = panel([
    heading('Create VC'),
    text('Would you like to create a VC from the following data?'),
    divider(),
    text(`Data:`),
    copyable(JSON.stringify(createVCArgs.credential, null, 2)),
  ]);

  if (config.dApp.disablePopups || (await snapConfirm(snap, content))) {
    const vc = await agent.createVerifiableCredential(createVCArgs);
    return vc;
  }

  throw new Error('User rejected create VC request');
}
