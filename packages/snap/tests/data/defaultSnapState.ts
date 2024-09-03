import {
  CURRENT_STATE_VERSION,
  type MascaAccountState,
  type MascaState,
} from '@blockchain-lab-um/masca-types';

import {
  getEmptyAccountState,
  getInitialPermissions,
} from '../../src/utils/config';

const defaultSnapState = (address: string): MascaState => {
  const accountState: Record<string, MascaAccountState> = {};
  accountState[address] = getEmptyAccountState();
  const state = {
    [CURRENT_STATE_VERSION]: {
      accountState,
      currentAccount: address,
      config: {
        dApp: {
          disablePopups: false,
          permissions: {
            'masca.io': getInitialPermissions(),
          },
        },
        snap: {
          acceptedTerms: true,
        },
      },
    },
  };
  return state as MascaState;
};

export const getDefaultSnapState = (address: string): MascaState => {
  const state = structuredClone(defaultSnapState(address));
  // Valid till 2024-08-30
  state[CURRENT_STATE_VERSION].accountState[address].general.ceramicSession =
    'eyJzZXNzaW9uS2V5U2VlZCI6IkoxZ0t3ZWY4b2dFeWtrWnRFTHpYZ3BwaHhjbXdHQzZOWmE2RUdqVmxRQUU9IiwiY2FjYW8iOnsiaCI6eyJ0IjoiZWlwNDM2MSJ9LCJwIjp7ImRvbWFpbiI6ImxvY2FsaG9zdCIsImlhdCI6IjIwMjQtMDktMDNUMTE6NTc6MjIuNjQxWiIsImlzcyI6ImRpZDpwa2g6ZWlwMTU1OjE6MHhiNjY2NTEyOGVlOTFkODQ1OTBmNzBjMzI2ODc2NTM4NGE5Y2FmYmNkIiwiYXVkIjoiZGlkOmtleTp6Nk1rZk1zeXZ5RnYxWkZ5eGNFQWl1RVdwVWZ3OGNOVjltcjlRZWFRVkVTVm81QU4iLCJ2ZXJzaW9uIjoiMSIsIm5vbmNlIjoiU1NPNmRIb0FSSSIsImV4cCI6IjIwMzQtMDktMDFUMTE6NTc6MjIuNjQxWiIsInN0YXRlbWVudCI6IkdpdmUgdGhpcyBhcHBsaWNhdGlvbiBhY2Nlc3MgdG8gc29tZSBvZiB5b3VyIGRhdGEgb24gQ2VyYW1pYyIsInJlc291cmNlcyI6WyJjZXJhbWljOi8vKiJdfSwicyI6eyJ0IjoiZWlwMTkxIiwicyI6IjB4MTUwYmU3MzE2OWZhMTU2MDFhNTdjNmIxYzliY2I3MTM1NzVhODg3ZDA5MzdhN2MzNDhkMzY1YWQwNTliY2RlZDBiM2MxOTg3NDcxYjM1ZDQ5MTc4MmRlNzA1OThlYTc0MTNmMDcxMjQwYmJjMTM5MmNlYTg2OGE3MTkwMTc5YWQxYyJ9fX0';
  return structuredClone(state);
};
