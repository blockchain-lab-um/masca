import { getAgent } from './../veramo/setup';
import { VCQuery } from '@blockchain-lab-um/ssi-snap-types';
import {
  IIdentifier,
  MinimalImportableKey,
  VerifiableCredential,
  VerifiablePresentation,
} from '@veramo/core';
import { getCurrentDid } from './didUtils';
import { snapConfirm } from './snapUtils';
import { SnapProvider } from '@metamask/snap-types';
import { availableVCStores } from '../veramo/plugins/availableVCStores';
import { SSISnapState } from '../interfaces';

/**
 * Saves a VC in the state object of the currently selected MetaMask account.
 * @param {VerifiableCredential} vc - The VC.
 * */
export async function veramoSaveVC(
  wallet: SnapProvider,
  vc: VerifiableCredential,
  vcStore: typeof availableVCStores[number]
): Promise<boolean> {
  const agent = await getAgent(wallet);
  return await agent.saveVC({ store: vcStore, vc });
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
  const agent = await getAgent(wallet);
  const vcsSnap = await agent.listVCS({ store: 'snap', query: query });

  if (vcStore === 'ceramic') {
    const vcsCeramic = await agent.listVCS({ store: 'ceramic', query: query });
    return [...vcsSnap.vcs, ...vcsCeramic.vcs];
  }
  return vcsSnap.vcs;
}

/**
 * Create a VP from a specific VC (if it exists), that is stored in MetaMask state under the currently selected MetaMask account.
 * @param {string} vcId - index of the VC
 * @param {string} domain - domain of the VP
 * @param {string} challenge - challenge of the VP
 * @returns {Promise<VerifiablePresentation | null>} - generated VP
 * */
export async function veramoCreateVP(
  wallet: SnapProvider,
  state: SSISnapState,
  account: string,
  vcId: string,
  challenge?: string,
  domain?: string
): Promise<VerifiablePresentation | null> {
  //GET DID
  const identifier = await veramoImportMetaMaskAccount(wallet, state, account);
  console.log('Identifier: ', identifier);
  //Get Veramo agent
  const agent = await getAgent(wallet);
  let vc;
  try {
    // FIXME: getVC should return null not throw an error
    vc = await agent.getVC({ store: 'snap', id: vcId });
  } catch (e) {
    if (state.accountState[account].accountConfig.ssi.vcStore === 'ceramic') {
      try {
        vc = await agent.getVC({ store: 'ceramic', id: vcId });
      } catch (e) {
        throw new Error('VC not found');
      }
    }
  }
  const config = state.snapConfig;
  console.log(vcId, domain, challenge);
  if (vc && vc.vc) {
    const promptObj = {
      prompt: 'Alert',
      description: 'Do you wish to create a VP from the following VC?',
      textAreaContent: JSON.stringify(vc.vc.credentialSubject),
    };

    if (config.dApp.disablePopups || (await snapConfirm(wallet, promptObj))) {
      if (challenge) console.log('Challenge:', challenge);
      if (domain) console.log('Domain:', domain);
      console.log('Identifier');
      console.log(identifier);

      const vp = await agent.createVerifiablePresentation({
        presentation: {
          holder: identifier,
          type: ['VerifiablePresentation', 'Custom'],
          verifiableCredential: [vc.vc],
        },
        challenge,
        domain,
        proofFormat: 'EthereumEip712Signature2021',
        save: false,
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
  wallet: SnapProvider,
  state: SSISnapState,
  account: string
): Promise<string> => {
  const agent = await getAgent(wallet);
  const method = state.accountState[account].accountConfig.ssi.didMethod;
  const did = await getCurrentDid(wallet, state, account);
  const identifiers = await agent.didManagerFind();

  let exists = false;
  identifiers.map((id: IIdentifier) => {
    if (id.did === did) exists = true;
  });
  if (exists) {
    console.log('DID already exists', did);
    return did;
  }

  console.log('Importing...');
  const controllerKeyId = `metamask-${account}`;
  await agent.didManagerImport({
    did,
    provider: method,
    controllerKeyId,
    keys: [
      {
        kid: controllerKeyId,
        type: 'Secp256k1',
        kms: 'web3',
        privateKeyHex: '',
        publicKeyHex: '',
        meta: {
          provider: 'metamask',
          account: account.toLowerCase(),
          algorithms: ['eth_signMessage', 'eth_signTypedData'],
        },
      } as MinimalImportableKey,
    ],
  });

  console.log('imported successfully');
  return did;
};
