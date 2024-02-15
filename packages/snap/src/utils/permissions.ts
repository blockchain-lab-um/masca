import {
  CURRENT_STATE_VERSION,
  DappPermissions,
  MascaRPCRequest,
  MascaState,
} from '@blockchain-lab-um/masca-types';

import { getInitialPermissions } from './config';

export function getPermissions(
  state: MascaState
): Record<string, DappPermissions> {
  return state[CURRENT_STATE_VERSION].config.dApp.permissions;
}

export function getDappPermissions(
  originHostname: string,
  state: MascaState
): DappPermissions {
  const permission = getPermissions(state)[originHostname];

  if (!permission) {
    return getInitialPermissions();
  }

  return permission;
}

export function permissionExists(originHostname: string, state: MascaState) {
  const permissions = getPermissions(state);
  return permissions[originHostname] !== undefined;
}

export function isTrustedDapp(
  originHostname: string,
  state: MascaState
): boolean {
  const permissions = getDappPermissions(originHostname, state);
  return permissions.trustedDapp as boolean;
}

export function isPermitted(
  originHostname: string,
  state: MascaState,
  method: MascaRPCRequest['method'] | 'other'
) {
  if (originHostname === 'other') {
    return true;
  }
  const permissions = getDappPermissions(originHostname, state);
  return permissions[method as MascaRPCRequest['method']] as boolean;
}
