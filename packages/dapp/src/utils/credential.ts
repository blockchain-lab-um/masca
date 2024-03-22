import type { QueryCredentialsRequestResult } from '@blockchain-lab-um/masca-connector';

export const isPolygonVC = (vc: QueryCredentialsRequestResult): boolean => {
  if (vc.data.proof) {
    if (Array.isArray(vc.data.proof as unknown as any)) {
      let isPolygon = false;
      (vc.data.proof as any[]).forEach((proof: { type: any }) => {
        if (
          typeof proof.type === 'string' &&
          (proof.type === 'BJJSignature2021' ||
            proof.type === 'Iden3SparseMerkleTreeProof')
        ) {
          isPolygon = true;
        }
        if (
          Array.isArray(proof.type) &&
          (proof.type.includes('BJJSignature2021') ||
            proof.type.includes('Iden3SparseMerkleTreeProof'))
        ) {
          isPolygon = true;
        }
      });
      return isPolygon;
    }
    if (typeof vc.data.proof === 'object') {
      if (
        typeof vc.data.proof.type === 'string' &&
        (vc.data.proof.type === 'BJJSignature2021' ||
          vc.data.proof.type === 'Iden3SparseMerkleTreeProof')
      ) {
        return true;
      }
      if (
        Array.isArray(vc.data.proof.type) &&
        (vc.data.proof.type.includes('BJJSignature2021') ||
          vc.data.proof.type.includes('Iden3SparseMerkleTreeProof'))
      ) {
        return true;
      }
      return false;
    }
  }
  return false;
};
