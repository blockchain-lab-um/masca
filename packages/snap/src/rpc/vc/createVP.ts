import type { CreateVPRequestParams } from '@blockchain-lab-um/masca-types';
import { BIP44CoinTypeNode } from '@metamask/key-tree';
import type {
  UnsignedPresentation,
  VerifiablePresentation,
  W3CVerifiableCredential,
} from '@veramo/core';

import type { ApiParams } from '../../interfaces';
import { getCurrentDidIdentifier } from '../../utils/didUtils';
import { veramoCreateVP } from '../../utils/veramoUtils';

async function createUnsignedVP(params: {
  vcs: W3CVerifiableCredential[];
  did: string;
}): Promise<UnsignedPresentation> {
  const { vcs, did } = params;
  const canonicalizedVcs = vcs.map((vc) => {
    // code from
    // https://github.com/uport-project/veramo/blob/2ce705680173174e7399c4d0607b67b7303c6c97/packages/credential-eip712/src/agent/CredentialEIP712.ts#L215
    if (typeof vc === 'string') {
      return vc;
    }
    if (vc.proof.jwt) {
      return vc.proof.jwt as string;
    }
    return JSON.stringify(vc);
  });

  const unsignedVp: UnsignedPresentation = {
    holder: did,
    verifiableCredential: canonicalizedVcs,
    type: ['VerifiablePresentation', 'Custom'],
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    issuanceDate: new Date().toISOString(),
  };
  return unsignedVp;
}

export async function createVP(
  params: ApiParams,
  createVPParams: CreateVPRequestParams
): Promise<VerifiablePresentation> {
  const { state, account, bip44CoinTypeNode } = params;
  const { vcs, proofFormat = 'jwt', proofOptions } = createVPParams;
  const method = state.accountState[account].accountConfig.ssi.didMethod;
  if (method === 'did:ethr' || method === 'did:pkh') {
    if (proofFormat !== 'EthereumEip712Signature2021') {
      throw new Error('proofFormat must be EthereumEip712Signature2021');
    }
    const identifier = await getCurrentDidIdentifier({
      ...params,
      bip44CoinTypeNode: bip44CoinTypeNode as BIP44CoinTypeNode,
    });
    const unsignedVp = await createUnsignedVP({
      vcs: createVPParams.vcs,
      did: identifier.did,
    });
    return unsignedVp as VerifiablePresentation;
  }
  const res = await veramoCreateVP(params, {
    vcs,
    proofFormat,
    proofOptions,
  });
  return res;
}
