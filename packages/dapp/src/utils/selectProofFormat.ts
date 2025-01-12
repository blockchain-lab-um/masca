export const selectProofFormat = (method: string) => {
  switch (method) {
    case 'did:ethr':
      return 'EthereumEip712Signature2021';
    case 'did:pkh':
    case 'did:jwk':
      return 'sd-jwt';
    case 'did:ens':
      return 'EthereumEip712Signature2021';
    case 'did:polygonid':
    case 'did:iden3':
      throw new Error('Not implemented yet');
    default:
      return 'jwt';
  }
};
