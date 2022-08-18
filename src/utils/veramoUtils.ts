import { getAgent } from './../veramo/setup';
import { VCQuery } from '@blockchain-lab-um/ssi-snap-types';
import {
  IIdentifier,
  MinimalImportableKey,
  VerifiableCredential,
  VerifiablePresentation,
} from '@veramo/core';
import { getCurrentDid, getCurrentMethod } from './didUtils';
import { getCurrentAccount } from './snapUtils';
import { getSnapConfig } from './stateUtils';
import { SnapProvider } from '@metamask/snap-types';

/**
 * Get an existing or create a new DID for the currently selected MetaMask account.
 * @returns {Promise<IIdentifier>} a DID.
 */
export async function veramoGetId(wallet: SnapProvider): Promise<IIdentifier> {
  const agent = await getAgent(wallet);
  const identifiers = await agent.didManagerFind();
  if (identifiers.length == 1) {
    console.log('DID Already exists for the selected MetaMask Account');
    return identifiers[0];
  }
  const identity = await agent.didManagerCreate();
  console.log(`New identity created`);
  console.log(identity);
  return identity;
}

/**
 * Saves a VC in the state object of the currently selected MetaMask account.
 * @param {VerifiableCredential} vc - The VC.
 * */
export async function veramoSaveVC(
  wallet: SnapProvider,
  vc: VerifiableCredential
) {
  const agent = await getAgent(wallet);
  await agent.saveVC({ vc });
}

/**
 * Get a list of VCs of the curently selected MetaMask account.
 * @returns {Promise<VerifiableCredential[]>} Array of saved VCs.
 */
export async function veramoListVCs(
  wallet: SnapProvider,
  query?: VCQuery
): Promise<VerifiableCredential[]> {
  const agent = await getAgent(wallet);
  // TODO: Additional type check for query ?
  const vcs = await agent.listVCS({ query: query });
  console.log('VCS', vcs);
  return vcs.vcs;
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
  vcId: string,
  challenge?: string,
  domain?: string
): Promise<VerifiablePresentation | null> {
  //GET DID
  const identifier = await veramoImportMetaMaskAccount(wallet);
  //Get Veramo agent
  const agent = await getAgent(wallet);
  //Get VC from state
  const vc = await agent.getVC({ id: vcId });
  const config = await getSnapConfig(wallet);
  console.log(vcId, domain, challenge);
  if (vc.vc !== null) {
    const result =
      config.dApp.disablePopups ||
      (await wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: 'Alert',
            description: 'Do you wish to create a VP from the following VC?',
            textAreaContent: JSON.stringify(vc.vc.credentialSubject),
          },
        ],
      }));
    console.log('RESULT', result);
    console.log('VC', vc);
    if (result) {
      if (challenge) console.log('Challenge:', challenge);
      if (domain) console.log('Domain:', domain);
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
  wallet: SnapProvider
): Promise<string> => {
  const agent = await getAgent(wallet);
  const account = await getCurrentAccount(wallet);
  const did = await getCurrentDid(wallet);
  const method = await getCurrentMethod(wallet);

  const identifiers = agent.didManagerFind();
  let exists = false;
  (await identifiers).map((id: IIdentifier) => {
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
        meta: {
          provider: 'metamask',
          account: account.toLocaleLowerCase(),
          algorithms: ['eth_signMessage', 'eth_signTypedData'],
        },
      } as MinimalImportableKey,
    ],
  });
  console.log('imported successfully');
  return did;
};
