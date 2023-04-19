import {
  AvailableVCStores,
  CreateVCRequestParams,
  CreateVPRequestParams,
  QueryVCsOptions,
  QueryVCsRequestResult,
  SaveVCRequestResult,
  VerifyDataRequestParams,
} from '@blockchain-lab-um/ssi-snap-types';
import { Filter } from '@blockchain-lab-um/veramo-vc-manager';
import { BIP44CoinTypeNode } from '@metamask/key-tree';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsGlobalObject } from '@metamask/snaps-types';
import { copyable, divider, heading, panel, text } from '@metamask/snaps-ui';
import {
  CredentialPayload,
  ICreateVerifiableCredentialArgs,
  IIdentifier,
  IVerifyResult,
  MinimalImportableKey,
  VerifiableCredential,
  VerifiablePresentation,
  W3CVerifiableCredential,
} from '@veramo/core';

import { ApiParams, SSISnapState } from '../interfaces';
import { Agent, getAgent } from '../veramo/setup';
import { getCurrentDid } from './didUtils';
import { snapGetKeysFromAddress } from './keyPair';
import { getPublicKey, snapConfirm } from './snapUtils';

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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      existingVC.store?.push(vc.store);
    } else {
      vcs.set(vc.id, {
        id: vc.id,
        store: [vc.store],
      });
    }
  }
  return [...vcs.values()];
}

export const veramoImportMetaMaskAccount = async (
  params: {
    snap: SnapsGlobalObject;
    ethereum: MetaMaskInpageProvider;
    state: SSISnapState;
    account: string;
    bip44CoinTypeNode: BIP44CoinTypeNode;
  },
  agent: Agent
): Promise<IIdentifier> => {
  const { snap, ethereum, state, account, bip44CoinTypeNode } = params;
  const method = state.accountState[account].accountConfig.ssi.didMethod;
  const did = await getCurrentDid({
    snap,
    ethereum,
    state,
    account,
    bip44CoinTypeNode,
  });

  const res = await snapGetKeysFromAddress(
    bip44CoinTypeNode,
    state,
    account,
    snap
  );
  if (!res) throw new Error('Failed to get keys');

  const publicKey = await getPublicKey({
    snap,
    state,
    account,
    bip44CoinTypeNode,
  });
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
  params: {
    snap: SnapsGlobalObject;
    state: SSISnapState;
    ethereum: MetaMaskInpageProvider;
    account: string;
    bip44CoinTypeNode: BIP44CoinTypeNode;
  },
  createVPParams: CreateVPRequestParams
): Promise<VerifiablePresentation> {
  const vcsMetadata = createVPParams.vcs;
  const domain = createVPParams.proofOptions?.domain;
  const challenge = createVPParams.proofOptions?.challenge;
  const proofFormat = createVPParams.proofFormat
    ? createVPParams.proofFormat
    : 'jwt';

  const { state, snap, ethereum, account, bip44CoinTypeNode } = params;
  // Get Veramo agent
  const agent = await getAgent(snap, ethereum);
  // GET DID
  const identifier = await veramoImportMetaMaskAccount(
    {
      snap,
      ethereum,
      state,
      account,
      bip44CoinTypeNode,
    },
    agent
  );

  const vcs: W3CVerifiableCredential[] = [];

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
      const vcResult = (await agent.verifyCredential({
        credential,
      })) as IVerifyResult;
      return vcResult;
    }
    if (presentation) {
      const vpResult = (await agent.verifyPresentation({
        presentation,
      })) as IVerifyResult;
      return vpResult;
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

  // Get Veramo agent
  const agent = await getAgent(snap, ethereum);
  // GET DID
  const identifier = await veramoImportMetaMaskAccount(
    {
      snap,
      state,
      ethereum,
      account,
      bip44CoinTypeNode: bip44CoinTypeNode as BIP44CoinTypeNode,
    },
    agent
  );
  const credentialPayload = minimalUnsignedCredential;
  credentialPayload.issuer = identifier.did;

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
