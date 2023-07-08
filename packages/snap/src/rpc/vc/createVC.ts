import type {
  CreateVCRequestParams,
  MinimalUnsignedCredential,
} from '@blockchain-lab-um/masca-types';
import { copyable, divider, heading, panel, text } from '@metamask/snaps-ui';
import type { UnsignedCredential, VerifiableCredential } from '@veramo/core';

import type { ApiParams } from '../../interfaces';
import { snapConfirm } from '../../utils/snapUtils';
import { veramoCreateVC } from '../../utils/veramoUtils';
import VeramoService from '../../veramo/Veramo.service';

async function createUnsignedVerifiableCredential(params: {
  vc: MinimalUnsignedCredential;
  did: string;
}): Promise<UnsignedCredential> {
  const { vc, did } = params;
  if (!vc.credentialSubject) {
    throw new Error('Verifiable credential must have a credentialSubject');
  }
  if (
    vc.type &&
    typeof vc.type === 'string' &&
    vc.type !== 'VerifiableCredential'
  ) {
    throw new Error('Invalid type');
  }

  if (
    (vc.issuer && typeof vc.issuer === 'string' && vc.issuer !== did) ||
    (vc.issuer?.id && vc.issuer.id && vc.issuer.id !== did)
  ) {
    throw new Error('Invalid issuer');
  }

  if (
    vc.type &&
    Array.isArray(vc.type) &&
    !vc.type.includes('VerifiableCredential')
  ) {
    vc.type.unshift('VerifiableCredential');
  }

  if (!vc.type) {
    vc.type = ['VerifiableCredential'];
  }

  const unsignedVc: UnsignedCredential = {
    ...vc,
    type: vc.type,
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    issuer: vc.issuer ? vc.issuer : did,
    issuanceDate: vc.issuanceDate ? vc.issuanceDate : new Date().toISOString(),
  };
  return unsignedVc;
}

export async function createVerifiableCredential(
  params: ApiParams,
  createVCParams: CreateVCRequestParams
): Promise<UnsignedCredential | VerifiableCredential> {
  const { state } = params;
  const { minimalUnsignedCredential, proofFormat, options } = createVCParams;
  const { store = 'snap' } = options ?? {};
  const { save } = options ?? {};
  const method = state.accountState[params.account].accountConfig.ssi.didMethod;

  if (method === 'did:ethr' || method === 'did:pkh') {
    const identifier = await VeramoService.getIdentifier();
    const unsignedVc = await createUnsignedVerifiableCredential({
      vc: minimalUnsignedCredential,
      did: identifier.did,
    });

    return unsignedVc;
  }
  const vc = await veramoCreateVC({
    minimalUnsignedCredential,
    proofFormat,
    options,
  });

  if (save === true) {
    const content = panel([
      heading('Save VC'),
      text('Would you like to save the following VC?'),
      divider(),
      text(`Store(s): ${typeof store === 'string' ? store : store.join(', ')}`),
      text(`VC:`),
      copyable(JSON.stringify(vc, null, 2)),
    ]);

    if (await snapConfirm(snap, content)) {
      await VeramoService.saveCredential({
        verifiableCredential: vc,
        store,
      });
    }
  }

  return vc;
}
