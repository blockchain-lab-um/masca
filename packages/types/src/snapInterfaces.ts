import { AvailableMethods, AvailableVCStores } from './constants';

export type SSISnapConfig = {
  snap: {
    infuraToken: string;
    acceptedTerms: boolean;
  };
  dApp: {
    disablePopups: boolean;
    friendlyDapps: string[];
  };
};

export type SSIAccountConfig = {
  ssi: {
    didMethod: AvailableMethods;
    vcStore: Record<AvailableVCStores, boolean>;
  };
};
