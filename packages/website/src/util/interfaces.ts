import type { MetaMaskSSISnap } from '@blockchain-lab-um/ssi-snap-connector';
import type { AvailableVCStores } from '@blockchain-lab-um/ssi-snap-types';

export interface SnapInitializationResponse {
  isSnapInstalled: boolean;
  snap?: MetaMaskSSISnap;
}

export interface SnapInstallationParams {
  snapId?: string;
  version?: string;
  supportedMethods?: ('did:ethr' | 'did:key')[] | undefined;
}

export interface VerifiableCredential {
  credentialSubject: {
    accomplishmentType: string;
    learnerName: string;
    achievement: string;
    courseProvider: string;
    id: string;
  };
  issuer: {
    id: string;
  };
  id: string;
  type: string[];
  credentialSchema: {
    id: string;
    type: string;
  };
  '@context': string[];
  issuanceDate: string;
  proof: {
    type: string;
    jwt: string;
  };
  key: string;
}

export interface DIDMethod {
  value: string;
  text: string | undefined;
}

export interface storeInitResponse {
  did: string;
  currDIDMethod: DIDMethod | undefined;
  availableMethods: DIDMethod[] | undefined;
  currVCStore: Record<AvailableVCStores, boolean>;
}
