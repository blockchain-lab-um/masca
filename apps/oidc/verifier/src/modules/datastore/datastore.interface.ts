export interface DataStoreObject<T> {
  data: T;
  created: number;
}

export interface DataStore<T> {
  [id: string]: DataStoreObject<T>;
}

export interface UserSession {
  credentialType: string;
  nonce: string;
  nonceExpiresIn: number;
}

export type UserSessionStore = DataStore<UserSession>;

export interface VerificationResults {
  verified: boolean;
}

export type VerificationResultsStore = DataStore<VerificationResults>;
