import {
  CURRENT_STATE_VERSION,
  type DappPermissions,
  type MascaRPCRequest,
  type MascaState,
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
  return permissions.trusted as boolean;
}

export function isPermitted(
  originHostname: string,
  state: MascaState,
  method: MascaRPCRequest['method'] | 'other'
) {
  if (method === 'other') {
    return true;
  }
  const permissions = getDappPermissions(originHostname, state);
  return permissions.methods[method as MascaRPCRequest['method']] as boolean;
}

export function isTrustedDomain(originHostname: string) {
  return ['masca.io', 'beta.masca.io', 'localhost', 'dev.masca.io'].includes(
    originHostname
  );
}
