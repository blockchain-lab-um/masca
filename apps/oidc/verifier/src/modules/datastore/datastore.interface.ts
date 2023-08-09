export interface DataStoreObject<T> {
  data: T;
  created: number;
}

export type DataStore<T> = Record<string, DataStoreObject<T>>;

export interface UserSession {
  credentialType: string;
  nonce: string;
  nonceExpiresIn: number;
}

export type UserSessionStore = DataStore<UserSession>;

export interface VerificationResults {
  verified: boolean;
  error?: string;
}

export type VerificationResultsStore = DataStore<VerificationResults>;
