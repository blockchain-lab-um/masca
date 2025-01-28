import type {
  MascaLegacyStateV1,
  MascaLegacyStateV2,
  MascaLegacyStateV3,
  MascaLegacyStateV4,
  MascaState,
} from '@blockchain-lab-um/masca-types';
import { emptyPolygonBaseState, getInitialPermissions } from './config';
import cloneDeep from 'lodash.clonedeep';

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

export const migrateToV3 = (state: MascaLegacyStateV2): MascaState => {
  const newState: any = { v3: state.v2 };

  // Remove eth chain from polygon state from all accounts
  const accounts = Object.keys(newState.v3.accountState);

  for (const account of accounts) {
    for (const method of ['polygonid', 'iden3']) {
      delete newState.v3.accountState[account].polygon.state[method].eth;
    }
  }

  return newState as MascaState;
};

export const migrateToV4 = (state: MascaLegacyStateV3): MascaState => {
  const newState: any = { v4: state.v3 };

  // Remove mumbai testnet from polygon state from all accounts and add amoy testnet
  const accounts = Object.keys(newState.v4.accountState);

  for (const account of accounts) {
    for (const method of ['polygonid', 'iden3']) {
      delete newState.v4.accountState[account].polygon.state[method].polygon
        .mumbai;

      newState.v4.accountState[account].polygon.state[method].polygon.amoy =
        cloneDeep(emptyPolygonBaseState);
    }
  }

  return newState as MascaState;
};

export const migrateToV5 = (state: MascaLegacyStateV4): MascaState => {
  const newState: any = { v5: state.v4 };

  const origins = Object.keys(newState.v5.config.dApp.permissions);

  for (const origin of origins) {
    // Add `decodeSdJwtPresentation` to permissions
    newState.v5.config.dApp.permissions[
      origin
    ].methods.decodeSdJwtPresentation = false;
  }

  return newState as MascaState;
};
