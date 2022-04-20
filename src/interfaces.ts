import { IIdentifier, IKey, VerifiableCredential } from "@veramo/core";
import { ManagedPrivateKey } from "@veramo/key-manager";

export interface Wallet {
  registerApiRequestHandler: (origin: unknown) => unknown;
  registerRpcMessageHandler: (origin: unknown) => unknown;
  request: (origin: any) => unknown;
  send(options: { method: string; params: unknown[] }): unknown;
  getAppKey(): Promise<string>;
}

export interface State {
  [snapStates: string]: any;
  //vcSnapState: VCState | undefined;
}

export interface VCState {
  [accountAddress: string]: VCStateAccount;
}

export type VCStateAccount = {
  snapPrivateKeyStore: Record<string, ManagedPrivateKey>;
  snapKeyStore: Record<string, IKey>;
  identifiers: Record<string, IIdentifier>;
  vcs: VerifiableCredential[];
};

export interface Response {
  error?: string;
  data?: any;
}
