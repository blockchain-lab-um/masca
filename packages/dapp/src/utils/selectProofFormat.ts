export const selectProofFormat = (method: string) => {
  switch (method) {
    case 'did:ethr':
    case 'did:pkg':
      return 'EthereumEip712Signature2021';
    case 'did:polygonid':
    case 'did:iden3':
      throw new Error('Not implemented yet');
    default:
      return 'jwt';
  }
};
