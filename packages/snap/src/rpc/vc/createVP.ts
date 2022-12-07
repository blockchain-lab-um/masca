import { veramoCreateVP } from '../../utils/veramoUtils';
import { VerifiablePresentation } from '@veramo/core';
import { ApiParams } from '../../interfaces';
import { CreateVPRequestParams } from '@blockchain-lab-um/ssi-snap-types';

export async function createVP(
  params: ApiParams,
  createVPParams: CreateVPRequestParams
): Promise<VerifiablePresentation | null> {
  const { vcs, proofFormat = 'jwt', proofOptions } = createVPParams;
  return await veramoCreateVP(params, { vcs, proofFormat, proofOptions });
}
