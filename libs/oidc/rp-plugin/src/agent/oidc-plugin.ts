import { IAgentPlugin } from '@veramo/core';
import qs from 'qs';
import { Claims } from '../types/internal';
import { IOIDCPlugin } from '../types/IOIDCPlugin';

/**
 * {@inheritDoc IMyAgentPlugin}
 * @beta
 */
export class OIDCPlugin implements IAgentPlugin {
  // readonly schema = schema.OIDCPlugin;

  readonly methods: IOIDCPlugin = {
    createAuthorizationRequest: this.createAuthenticationRequest.bind(this),
    handleAuthorizationResponse: this.handleAuthenticationResponse.bind(this),
  };

  // Create Self-Issued OpenID Provider Authentication Request
  // https://openid.net/specs/openid-connect-self-issued-v2-1_0.html#section-10
  private async createAuthenticationRequest(): Promise<string> {
    // https://identity.foundation/presentation-exchange/
    // https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#section-5

    // TODO: Include either presentation_definition or presentation_definition_uri
    const claims: Claims = {
      presentation_definition: {
        id: 'id card credential (example)',
        // Format type registry: https://identity.foundation/claim-format-registry/#registry
        // https://identity.foundation/presentation-exchange/#presentation-definition
        format: {
          jwt_vc: {
            alg: ['ES256K'],
          },
          jwt_vp: {
            alg: ['ES256K'],
          },
        },
        input_descriptors: [
          {
            id: 'id card credential (example)',
            name: 'ID Card',
            purpose: 'To verify your identity',
            constraints: {
              limit_disclosure: 'required',
              fields: [
                // TODO: Make it generic
                {
                  path: ['$.type'],
                  filter: {
                    type: 'string',
                    pattern: 'IDCardCredential',
                  },
                },
                {
                  path: ['$.credentialSubject.givenName'],
                  purpose: 'To verify your identity',
                },
              ],
            },
          },
        ],
      },
    };

    const redirectUri = 'https://example.com/redirect'; // Change this to your redirect URI
    const nonce = crypto.randomUUID();

    // TODO: Support signed version of request -> client_id needs to be a DID
    // https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#section-8.2.3 - client_metadata
    const params = {
      response_type: 'id_token',
      // https://openid.net/specs/openid-connect-self-issued-v2-1_0.html#section-9.2.1
      client_id: redirectUri,
      redirect_uri: redirectUri,
      scope: 'openid',
      nonce,
      claims: JSON.stringify(claims),
    };

    // TODO: Redirect handling
    return `openid://?${qs.stringify(params)}`;
  }

  private async handleAuthenticationResponse(
    contentTypeHeader: string,
    body: { id_token: string; vp_token: string }
  ): Promise<void> {
    // Response needs to include `Content-Type` header with value `application/x-www-form-urlencoded`
    // https://openid.net/specs/openid-connect-self-issued-v2-1_0.html#section-11.2
    // Checks if header includes `application/x-www-form-urlencoded`
    if (!contentTypeHeader.includes('application/x-www-form-urlencoded')) {
      throw new Error(
        `Invalid Content-Type header: ${contentTypeHeader}. Expected 'application/x-www-form-urlencoded'`
      );
    }

    console.log(body);
    // const { id_token: idToken, vp_token: vpToken } = body;
  }
}

export default OIDCPlugin;
