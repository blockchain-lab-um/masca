import { IIdentifier, IKey } from "@veramo/core";
import { ManagedPrivateKey } from "@veramo/key-manager";

export type MetamaskState = {
  didMethod: {
    privKey: string;
    vcs: string[];
  };
};

export type MetamaskDIDRequest = any;

export type FMethodCallback = (
  originString: string,
  requestObject: MetamaskDIDRequest
) => Promise<unknown>;

export const EmptyMetamaskState: () => MetamaskState = () => ({
  didMethod: {
    privKey: "",
    vcs: [],
  },
});

export interface Wallet {
  registerApiRequestHandler: (origin: unknown) => unknown;
  registerRpcMessageHandler: (origin: unknown) => unknown;
  request: (origin: any) => unknown;
  send(options: { method: string; params: unknown[] }): unknown;
  getAppKey(): Promise<string>;
  updatePluginState(state: MetamaskState): void;
  getPluginState(): MetamaskState;
}

export interface Asset {
  balance: string | number;
  customViewUrl?: string;
  decimals?: number;
  identifier: string;
  image?: string;
  symbol: string;
}

export interface W3CCredential {
  "@context": string[];
  id?: string;
  type: string[];
  issuer: { id: string; [x: string]: any };
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: {
    id?: string;
    [x: string]: any;
  };
  credentialStatus?: {
    id: string;
    type: string;
  };
  [x: string]: any;
}

export interface VerifiableCredential extends W3CCredential {
  proof: {
    type?: string;
    [x: string]: any;
  };
}

export interface VCEncryptionAccount {
  account: string;
  encPubKey: any;
}

// export interface MMState {
//   [propName: string]: any;
//   vcStorage: VCStorage;
//   vcEncryptionAccount: VCEncryptionAccount;
// }

// export interface MMStateRaw extends MMState {
//   [propName: string]: any;
// }

export interface State {
  [propName: string]: any;
  //vcSnapState: VCState | undefined;
}

export interface VCState {
  [propName: string]: VCAccount;
}

export type VCStateVeramo = VCState & {
  snapPrivateKeyStore: Record<string, ManagedPrivateKey>;
  snapKeyStore: Record<string, IKey>;
  identifiers: Record<string, IIdentifier>;
};

export interface VCAccount {
  encPubKey: string;
  encryptedData: string;
}

export interface DecryptedVCData {
  pKey: string;
  address: string;
  vcs: Array<VerifiableCredential>;
}

export interface Response {
  error?: string;
  data?: any;
}
