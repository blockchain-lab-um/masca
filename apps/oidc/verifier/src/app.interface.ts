import { AuthorizationResponse } from '@blockchain-lab-um/oidc-types';

export interface AuthorizationRequest {
  credentialType: string;
  state: string;
}

export interface AuthorizationResponseBody extends AuthorizationResponse {
  state: string;
}
