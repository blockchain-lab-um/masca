import { MascaLegacyStateV1, MascaState } from '@blockchain-lab-um/masca-types';
import { getInitialPermissions } from './config';

export const migrateToV2 = (state: MascaLegacyStateV1): MascaState => {
  const newState: any = { v2: state.v1 };

  // Remove friendly dapps
  delete newState.v2.config.dApp.friendlyDapps;

  // Remove goerli from polygon state from all accounts
  const accounts = Object.keys(newState.v2.accountState);

  for (const account of accounts) {
    for (const method of ['polygonid', 'iden3']) {
      for (const chain of ['eth', 'polygon']) {
        delete newState.v2.accountState[account].polygon.state[method][chain]
          .goerli;
      }
    }
  }

  // Initialize permissions
  newState.v2.config.dApp.permissions = { 'masca.io': getInitialPermissions() };

  return newState as MascaState;
};
