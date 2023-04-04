import { CreateVPRequestParams } from '@blockchain-lab-um/masca-types';
import { VerifiablePresentation } from '@veramo/core';

import { ApiParams } from '../../interfaces';
import { veramoCreateVP } from '../../utils/veramoUtils';

export async function createVP(
  params: ApiParams,
  createVPParams: CreateVPRequestParams
): Promise<VerifiablePresentation> {
  const { vcs, proofFormat = 'jwt', proofOptions } = createVPParams;
  const res = await veramoCreateVP(params, { vcs, proofFormat, proofOptions });
  return res;
}
