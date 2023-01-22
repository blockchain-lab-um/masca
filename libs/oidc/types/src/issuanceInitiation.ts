// https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-appendix.e

import { SupportedCredentialFormats } from './credential';

// FIXME: Needs to be implemented correctly
interface Credential {
  format: SupportedCredentialFormats;
  types: string[];
}

export type Credentials = (string | Credential)[];

export interface IssuanceRequestParams {
  issuer: string;
  credentials: Credentials;
  'pre-authorized_code'?: string;
  user_pin_required?: boolean;
  op_state?: string;
}
