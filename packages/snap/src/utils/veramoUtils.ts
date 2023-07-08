import type {
  CreateVCRequestParams,
  CreateVPRequestParams,
} from '@blockchain-lab-um/masca-types';
import { copyable, divider, heading, panel, text } from '@metamask/snaps-ui';
import type {
  CredentialPayload,
  ICreateVerifiableCredentialArgs,
  VerifiableCredential,
  VerifiablePresentation,
} from '@veramo/core';

import VeramoService from '../veramo/Veramo.service';
import { snapConfirm } from './snapUtils';
import { getSnapState } from './stateUtils';

export async function veramoCreateVP(
  createVPParams: CreateVPRequestParams
): Promise<VerifiablePresentation> {
  const state = await getSnapState(snap);
  const { vcs, proofFormat, proofOptions } = createVPParams;

  if (vcs.length === 0) {
    throw new Error('No credentials provided');
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
    const vp = await VeramoService.createPresentation({
      vcs,
      proofFormat,
      proofOptions,
    });

    return vp;
  }

  throw new Error('User rejected create VP request');
}

export async function veramoCreateVC(
  createVCParams: CreateVCRequestParams
): Promise<VerifiableCredential> {
  const state = await getSnapState(snap);
  const { minimalUnsignedCredential, proofFormat = 'jwt' } = createVCParams;
  const credentialPayload = minimalUnsignedCredential;
  const identifier = await VeramoService.getIdentifier();

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
    const vc = await VeramoService.createCredential(createVCArgs);
    return vc;
  }

  throw new Error('User rejected create VC request');
}
