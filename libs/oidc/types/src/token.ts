import type { TokenRequestOAuth2, TokenResponseOAuth2 } from './oauth2.js';

/**
 *
 * SPECS:
 * - https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-6.1
 */
export interface TokenRequest extends Omit<TokenRequestOAuth2, 'grant_type'> {
  grant_type:
    | 'authorization_code'
    | 'urn:ietf:params:oauth:grant-type:pre-authorized_code';
  'pre-authorized_code'?: string;
  user_pin?: string;
}

/**
 * Token Response
 *
 * SPECS:
 * - https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-6.2
 */
export interface TokenResponse extends TokenResponseOAuth2 {
  c_nonce?: string;
  c_nonce_expires_in?: number;
  authorization_pending?: boolean;
  interval?: number;
}
