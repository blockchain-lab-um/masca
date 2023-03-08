import { Result, ResultObject } from '@blockchain-lab-um/utils';

export type GetSnapsResponse = {
  [snapId: string]: {
    blocked: boolean;
    enabled: boolean;
    id: string;
    initialPermissions?: { [k: string]: unknown };
    permissionName: string;
    version: string;
  };
};

const getWalletSnaps = async (): Promise<GetSnapsResponse> => {
  return window.ethereum.request({
    method: 'wallet_getSnaps',
  });
};

/**
 * Checks if a snap is installed
 *
 * @param snapOrigin - snap origin
 * @param version - snap version
 *
 * @returns boolean - true if snap is installed
 */
export async function isSnapInstalled(
  snapOrigin: string,
  version: string
): Promise<Result<boolean>> {
  const snaps = await getWalletSnaps();

  if (!(snapOrigin in snaps)) {
    return ResultObject.success(false);
  }

  if (snaps[snapOrigin].version !== version) {
    return ResultObject.error(
      new Error(
        `Snap version mismatch. Expected ${version} but got ${snaps[snapOrigin].version}`
      )
    );
  }

  return ResultObject.success(true);
}
