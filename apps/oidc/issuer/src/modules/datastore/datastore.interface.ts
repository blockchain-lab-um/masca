import { Credentials } from '@blockchain-lab-um/oidc-types';

export interface DataStoreObject<T> {
  data: T;
  created: number;
}

export interface DataStore<T> {
  [id: string]: DataStoreObject<T>;
}

export interface UserSession {
  credentials: Credentials;
  user_pin?: string;
  expires_in?: number;
  c_nonce?: string;
  c_nonce_expires_in?: number;
  authorization_pending?: boolean;
  interval?: number;
}

export type UserSessionStore = DataStore<UserSession>;
