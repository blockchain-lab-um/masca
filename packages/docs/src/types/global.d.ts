export {};

declare global {
  interface Window {
    ethereum?: import('@metamask/providers').MetaMaskInpageProvider;
  }

  /*
    Define MetaMask RPC result types
  */
  type WalletGetSnapsResult = Record<
    string,
    {
      /**
       * The ID of the Snap.
       */
      id: SnapId;

      /**
       * The initial permissions of the Snap, which will be requested when it is
       * installed.
       */
      initialPermissions: RequestedSnapPermissions;

      /**
       * The name of the permission used to invoke the Snap.
       */
      permissionName: string;

      /**
       * The version of the Snap.
       */
      version: string;
    }
  >;

  type WalletInstallSnapsResult = Record<
    string,
    | WalletGetSnapsResult[string]
    | {
        error: Error;
      }
  >;

  interface WalletEnableResult {
    // The user's Ethereum accounts, if the eth_accounts permission has been
    // granted.
    accounts: string[];
    // The permissions granted to the requester.
    permissions: Web3WalletPermission[];
    // The user's installed snaps that the requester is permitted to access.
    snaps: WalletInstallSnapsResult;
    errors?: Error[]; // Any errors encountered during processing.
  }
}
