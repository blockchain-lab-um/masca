import {
  CURRENT_STATE_VERSION,
  type MascaState,
} from '@blockchain-lab-um/masca-types';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { DIDSession } from 'did-session';

export const aliases = {
  definitions: {
    StoredCredentials: process.env.IS_TESTING
      ? 'kjzl6cwe1jw14a05nhefxjqb74krvxgyzdaje4jnrcaie48vw31pwxxoa7qw5z9'
      : 'kjzl6cwe1jw147v1tf19hxyi1q5ix5s948cfm35xp55a2cngoux776kg3ypzj3p',
  },
  schemas: {
    StoredCredentials: process.env.IS_TESTING
      ? 'ceramic://k3y52l7qbv1frxl7mazhftozd9tpwugrwafoqiyuuludx7s42u7crnzc4jh9ddrls'
      : 'ceramic://k3y52l7qbv1fryl3piyoqwt5lplg02kvza59o347nfmm1ubpuywghfhg3odiqbwu8',
  },
  tiles: {},
};

/**
 * Function that validates a DID session.
 * @param serializedSession - serialized DID session string
 * @returns string - serialized DID session string
 */
export async function validateSession(
  serializedSession?: string
): Promise<string> {
  if (!serializedSession) {
    throw new Error('No session found');
  }

  const session = await DIDSession.fromSession(serializedSession);

  if (session.isExpired) {
    throw new Error('Session expired');
  }

  if (session.expireInSecs < 3600) {
    throw new Error('Session will expire soon');
  }

  return serializedSession;
}

/**
 * Function that returns the DID from a Ceramic session.
 * @param state - Masca state
 * @returns DID - DIDSession DID object
 */
async function authenticateWithSessionKey(state: MascaState) {
  const serializedSession = await validateSession(
    state[CURRENT_STATE_VERSION].accountState[
      state[CURRENT_STATE_VERSION].currentAccount
    ].general.ceramicSession
  );
  const session = await DIDSession.fromSession(serializedSession);

  return session.did;
}

/**
 * Function that creates a Ceramic client and authenticates it with a session key.
 * @param state - Masca state
 * @returns CeramicClient - Ceramic client
 */
export async function getCeramic(state: MascaState): Promise<CeramicClient> {
  const ceramicEndpoint = process.env.IS_TESTING
    ? 'https://ceramic-clay.3boxlabs.com'
    : 'https://ceramic.masca.io';
  const ceramic = new CeramicClient(ceramicEndpoint);
  const did = await authenticateWithSessionKey(state);

  await ceramic.setDID(did);
  return ceramic;
}
