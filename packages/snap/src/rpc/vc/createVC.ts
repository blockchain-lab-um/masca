import type { CreateVCRequestParams } from '@blockchain-lab-um/masca-types';
import { BIP44CoinTypeNode } from '@metamask/key-tree';
import { copyable, divider, heading, panel, text } from '@metamask/snaps-ui';
import type { VerifiableCredential } from '@veramo/core';

import type { ApiParams } from '../../interfaces';
import { getCurrentDidIdentifier } from '../../utils/didUtils';
import { snapConfirm } from '../../utils/snapUtils';
import { veramoCreateVC, veramoSaveVC } from '../../utils/veramoUtils';

export async function createVC(
  params: ApiParams,
  createVCParams: CreateVCRequestParams
): Promise<Omit<VerifiableCredential, 'proof'>> {
  const { state, bip44CoinTypeNode } = params;
  const { minimalUnsignedCredential, proofFormat, options } = createVCParams;
  const { store = 'snap' } = options ?? {};
  const { save } = options ?? {};
  const method = state.accountState[params.account].accountConfig.ssi.didMethod;
  if (method === 'did:ethr' || method === 'did:pkh') {
    const identifier = await getCurrentDidIdentifier({
      ...params,
      bip44CoinTypeNode: bip44CoinTypeNode as BIP44CoinTypeNode,
    });
    return {
      ...minimalUnsignedCredential,
      issuer: identifier.did,
      issuanceDate: new Date().toISOString(),
    };
  }
  const vc = await veramoCreateVC(params, {
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
      await veramoSaveVC({
        snap: params.snap,
        ethereum: params.ethereum,
        verifiableCredential: vc,
        store,
      });
    }
  }

  return vc;
}
