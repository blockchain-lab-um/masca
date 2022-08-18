import { SSIAccountConfig } from "./../interfaces";
import { SSIAccountState, SSISnapConfig } from "../interfaces";

export const emptyVCAccount = {
  snapKeyStore: {},
  snapPrivateKeyStore: {},
  vcs: {},
  identifiers: {},
  publicKey: "",
  accountConfig: {
    ssi: {
      didMethod: "did:ethr",
      didStore: "snap",
    },
  } as SSIAccountConfig,
} as SSIAccountState;

export const defaultConfig = {
  dApp: {
    disablePopups: false,
    friendlyDapps: [],
  },
  snap: {
    infuraToken: "6e751a2e5ff741e5a01eab15e4e4a88b",
    acceptedTerms: false,
  },
} as SSISnapConfig;
