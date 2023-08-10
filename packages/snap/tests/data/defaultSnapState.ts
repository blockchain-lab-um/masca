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
          friendlyDapps: [],
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
  // Session is valid for two years from 15/06/2023 for address 1 only
  state[CURRENT_STATE_VERSION].accountState[address].general.ceramicSession =
    'eyJzZXNzaW9uS2V5U2VlZCI6IlJCcGVUK3poMmFpQ2xOTVBZYXllYUFSSVBhVkZUZ1pZVHU4M3I0dHBpR1U9IiwiY2FjYW8iOnsiaCI6eyJ0IjoiZWlwNDM2MSJ9LCJwIjp7ImRvbWFpbiI6Ik15Tm9kZUFwcCIsImlhdCI6IjIwMjMtMDYtMTVUMTI6Mjc6NTguNzgyWiIsImlzcyI6ImRpZDpwa2g6ZWlwMTU1OjE6MHhiNjY2NTEyOGVlOTFkODQ1OTBmNzBjMzI2ODc2NTM4NGE5Y2FmYmNkIiwiYXVkIjoiZGlkOmtleTp6Nk1rd1V6aW5FU2lGdWo2dlR1bk1kbVYyTWtvbm1ud3lkdlE4Rjlwc0xzQ0xyUW8iLCJ2ZXJzaW9uIjoiMSIsIm5vbmNlIjoiSnFKTTNZcFc5ayIsImV4cCI6IjIwMjUtMDYtMTRUMTI6Mjc6NTguNzgyWiIsInN0YXRlbWVudCI6IkdpdmUgdGhpcyBhcHBsaWNhdGlvbiBhY2Nlc3MgdG8gc29tZSBvZiB5b3VyIGRhdGEgb24gQ2VyYW1pYyIsInJlc291cmNlcyI6WyJjZXJhbWljOi8vKj9tb2RlbD1ranpsNmh2ZnJidzZjNmlkYWFjdzVkNGdjNDgxZW5wYmV1djRmYXQ2NmdqcTFrazlpdnRhbmFkc2UwNzQ2ZGwiXX0sInMiOnsidCI6ImVpcDE5MSIsInMiOiIweGNmZjk0YjgyZmVlODZmZmM0Zjg0ZjYxODFmMDRkNGY2NGY5ZmVmZTAyODgyNzg4Mzc1M2ZhNWFiYThiM2VkYWQ3NzdhZThjMGY3ZTQ0MTIzMzM2ZmQzNjIwNjA5MWE0NmM0MDYxZTQzZGY4OGVhYzdmZWI2ZTE2M2Y5Yzc2OWI3MWMifX19';
  return structuredClone(state);
};
