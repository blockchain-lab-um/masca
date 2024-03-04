import {
  CURRENT_STATE_VERSION,
  MascaAccountState,
  MascaState,
} from '@blockchain-lab-um/masca-types';

import { getEmptyAccountState } from '../../src/utils/config';

const defaultSnapState = (address: string): MascaState => {
  const accountState: Record<string, MascaAccountState> = {};
  accountState[address] = getEmptyAccountState();

  return {
    v1: {
      accountState,
      currentAccount: address,
      config: {
        dApp: {
          disablePopups: false,
          permissions: {},
        },
        snap: {
          acceptedTerms: true,
        },
      },
    },
  };
};

export const getDefaultSnapState = (address: string): MascaState => {
  const state = structuredClone(defaultSnapState(address));
  // Valid till 2024-08-30
  state[CURRENT_STATE_VERSION].accountState[address].general.ceramicSession =
    'eyJzZXNzaW9uS2V5U2VlZCI6IjFXL0Y1QlpUS3k0U0NPTnhreFNQNXUxc29hMjVHcFlSSkVMY0dHbUdVVzQ9IiwiY2FjYW8iOnsiaCI6eyJ0IjoiZWlwNDM2MSJ9LCJwIjp7ImRvbWFpbiI6ImxvY2FsaG9zdCIsImlhdCI6IjIwMjMtMDgtMzFUMTM6NDA6NDYuMjIzWiIsImlzcyI6ImRpZDpwa2g6ZWlwMTU1OjE6MHhiNjY2NTEyOGVlOTFkODQ1OTBmNzBjMzI2ODc2NTM4NGE5Y2FmYmNkIiwiYXVkIjoiZGlkOmtleTp6Nk1rdHhTWGlNYTI3REhQaDk1NFhVNWpxUFRZajFDRlZVQXp0eFd4RWhVM2pOaVoiLCJ2ZXJzaW9uIjoiMSIsIm5vbmNlIjoiU3JzV0trcVd6QSIsImV4cCI6IjIwMjQtMDgtMzBUMTM6NDA6NDYuMjIzWiIsInN0YXRlbWVudCI6IkdpdmUgdGhpcyBhcHBsaWNhdGlvbiBhY2Nlc3MgdG8gc29tZSBvZiB5b3VyIGRhdGEgb24gQ2VyYW1pYyIsInJlc291cmNlcyI6WyJjZXJhbWljOi8vKiJdfSwicyI6eyJ0IjoiZWlwMTkxIiwicyI6IjB4YTM1ZGYwMmI1MWVhMmVjYmY0ZDc4YWMxNmNjNzA0YjUwYWRmNjBmYTYwZGNkM2NiMTYyZjgxOGU0YzkwZGNhNjdkYTllNDEzZTg1MzcxOWFkMjZlMGI1YjQyMDIwNGEyMDk5NTJlZTA0ODZkZDA5ODIxMzg4ODNmZmY3MGY2OTYxYyJ9fX0';
  return structuredClone(state);
};
