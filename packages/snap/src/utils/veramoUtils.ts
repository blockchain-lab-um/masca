import { Agent, getAgent } from './../veramo/setup';
import { VCQuery } from '@blockchain-lab-um/ssi-snap-types';
import {
  IIdentifier,
  MinimalImportableKey,
  VerifiableCredential,
  VerifiablePresentation,
  W3CVerifiableCredential,
} from '@veramo/core';
import { getCurrentDid } from './didUtils';
import { getPublicKey, snapConfirm } from './snapUtils';
import { SnapProvider } from '@metamask/snap-types';
import { AvailableVCStores, availableVCStores } from '../constants/index';
import { ApiParams } from '../interfaces';
import { snapGetKeysFromAddress } from './keyPair';
import { BIP44CoinTypeNode } from '@metamask/key-tree';

/**
 * Saves a VC in the state object of the currently selected MetaMask account.
 * @param {VerifiableCredential} vc - The VC.
 * */
export async function veramoSaveVC(
  wallet: SnapProvider,
  verifiableCredential: W3CVerifiableCredential,
  store: AvailableVCStores | [AvailableVCStores]
): Promise<boolean> {
  const agent = await getAgent(wallet);
  return await agent.saveVC({
    store: store as string,
    vc: verifiableCredential as VerifiableCredential,
  });
}

/**
 * Get a list of VCs of the curently selected MetaMask account.
 * @returns {Promise<VerifiableCredential[]>} Array of saved VCs.
 */
export async function veramoListVCs(
  wallet: SnapProvider,
  vcStore: typeof availableVCStores[number],
  query?: VCQuery
): Promise<VerifiableCredential[]> {
  console.log('Getting agent');

  const agent = await getAgent(wallet);
  console.log(agent);
  const vcsSnap = await agent.listVCS({ store: 'snap', query: query });
  console.log(vcsSnap);
  if (vcStore === 'ceramic') {
    const vcsCeramic = await agent.listVCS({ store: 'ceramic', query: query });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment
    return [...vcsSnap.vcs, ...vcsCeramic.vcs];
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return vcsSnap.vcs;
}

/**
 * Create a VP from a specific VC (if it exists), that is stored in MetaMask state under the currently selected MetaMask account.
 * @param {string} vcId - index of the VC
 * @param {string} domain - domain of the VP
 * @param {string} challenge - challenge of the VP
 * @returns {Promise<VerifiablePresentation | null>} - generated VP
 * */

type CreateVPRequestParams = {
  vcs: [
    {
      id: string;
      metadata?: {
        store?: AvailableVCStores;
      };
    }
  ];

  proofFormat?: string;
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
  const id = createVPParams.vcs[0].id;
  const store = createVPParams.vcs[0].metadata?.store;
  const domain = createVPParams.proofOptions?.domain;
  const challenge = createVPParams.proofOptions?.challenge;
  const proofFormat = createVPParams.proofFormat;

  const { state, wallet, account } = params;
  //Get Veramo agent
  const agent = await getAgent(wallet);
  //GET DID
  const identifier = await veramoImportMetaMaskAccount(params, agent);
  console.log('Identifier: ', identifier);
  let vc;
  try {
    // FIXME: getVC should return null not throw an error
    vc = await agent.getVC({ store: 'snap', id: id });
  } catch (e) {
    if (state.accountState[account].accountConfig.ssi.vcStore['ceramic']) {
      try {
        vc = await agent.getVC({ store: 'ceramic', id: id });
      } catch (e) {
        throw new Error('VC not found');
      }
    }
  }
  const config = state.snapConfig;
  if (vc && vc.vc) {
    const promptObj = {
      prompt: 'Alert',
      description: 'Do you wish to create a VP from the following VC?',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      textAreaContent: JSON.stringify(vc.vc.credentialSubject),
    };

    if (config.dApp.disablePopups || (await snapConfirm(wallet, promptObj))) {
      if (challenge) console.log('Challenge:', challenge);
      if (domain) console.log('Domain:', domain);
      console.log('Identifier');
      console.log(identifier);

      const vp = await agent.createVerifiablePresentation({
        presentation: {
          holder: identifier.did,
          type: ['VerifiablePresentation', 'Custom'],
          verifiableCredential: [vc.vc],
        },
        proofFormat: 'jwt',
        domain: domain,
        challenge: challenge,
      });
      console.log('....................VP..................');
      console.log(vp);
      return vp;
    }
    return null;
  }
  console.log('No VC found...');
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
  if (!res) {
    throw new Error('Failed to get keys');
  }
  const publicKey = await getPublicKey(params);
  console.log('Importing...');
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
        privateKeyHex: res.privateKey,
        publicKeyHex: publicKey,
      } as MinimalImportableKey,
    ],
  });
  return identifier;
};
