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
  request: (origin: unknown) => unknown;
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
