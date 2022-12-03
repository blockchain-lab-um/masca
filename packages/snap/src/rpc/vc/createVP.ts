import { veramoCreateVP } from '../../utils/veramoUtils';
import { VerifiablePresentation } from '@veramo/core';
import { ApiParams } from '../../interfaces';
import {
  AvailableVCStores,
  SupportedProofFormats,
} from '@blockchain-lab-um/ssi-snap-types';

type CreateVPRequestParams = {
  vcs: [
    {
      id: string;
      metadata?: {
        store?: AvailableVCStores;
      };
    }
  ];

  proofFormat?: SupportedProofFormats;
  proofOptions?: {
    type?: string;
    domain?: string;
    challenge?: string;
  };
};

export async function createVP(
  params: ApiParams,
  createVPParams: CreateVPRequestParams
): Promise<VerifiablePresentation | null> {
  const { vcs, proofFormat = 'jwt', proofOptions } = createVPParams;
  return await veramoCreateVP(params, { vcs, proofFormat, proofOptions });
}
