import {
  CURRENT_STATE_VERSION,
  MascaLegacyStateV1,
  MascaState,
} from '@blockchain-lab-um/masca-types';
import { getInitialPermissions } from './config';

export const migrateToV2 = (state: MascaLegacyStateV1): MascaState => {
  const newState: any = { v2: state.v1 };

  // Remove friendly dapps
  newState.v2.config.dApp.friendlyDapps = undefined;

  // Initialize permissions
  newState.v2.config.dApp.permissions = { 'masca.io': getInitialPermissions() };

  return newState as MascaState;
};
