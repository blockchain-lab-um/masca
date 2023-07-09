import type {
  UnsignedPresentation,
  W3CVerifiableCredential,
} from '@veramo/core';

export async function createUnsignedVerifiablePresentation(params: {
  vcs: W3CVerifiableCredential[];
  did: string;
}): Promise<UnsignedPresentation> {
  const { vcs, did } = params;
  // FIXME: there's an issue here
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
