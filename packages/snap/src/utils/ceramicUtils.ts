import type { MascaState } from '@blockchain-lab-um/masca-types';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { DIDSession } from 'did-session';

export const aliases = {
  definitions: {
    StoredCredentials:
      'kjzl6cwe1jw14a05nhefxjqb74krvxgyzdaje4jnrcaie48vw31pwxxoa7qw5z9',
  },
  schemas: {
    StoredCredentials:
      'ceramic://k3y52l7qbv1frxl7mazhftozd9tpwugrwafoqiyuuludx7s42u7crnzc4jh9ddrls',
  },
  tiles: {},
};

// Should return serialized session or throw an error
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

async function authenticateWithSessionKey(state: MascaState) {
  const serializedSession = await validateSession(
    state.accountState[state.currentAccount].ceramicSession
  );
  const session = await DIDSession.fromSession(serializedSession);
  return session.did;
}

export async function getCeramic(state: MascaState): Promise<CeramicClient> {
  const ceramic = new CeramicClient('https://ceramic-clay.3boxlabs.com');
  const did = await authenticateWithSessionKey(state);

  await ceramic.setDID(did);
  return ceramic;
}
