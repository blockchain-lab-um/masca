import { veramoCreateVP } from '../../utils/veramoUtils';
import { VerifiablePresentation } from '@veramo/core';
import { ApiParams } from '../../interfaces';
import { AvailableVCStores } from '@blockchain-lab-um/ssi-snap-types/constants';

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

export async function createVP(
  params: ApiParams,
  createVPParams: CreateVPRequestParams
): Promise<VerifiablePresentation | null> {
  if (createVPParams.proofFormat === undefined)
    createVPParams.proofFormat = 'jwt';
  if (
    createVPParams.proofOptions?.type === 'EthereumEip712Signature2021' &&
    createVPParams.proofFormat === 'lds'
  )
    createVPParams.proofFormat = 'EthereumEip712Signature2021';
  return await veramoCreateVP(params, createVPParams);
}
