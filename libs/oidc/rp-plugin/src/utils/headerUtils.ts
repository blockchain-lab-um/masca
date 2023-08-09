import DetailedError from './detailedError.js';
import { Result } from './result.js';

export interface IsValidAuthorizationHeaderArgs {
  authorizationHeader: string;
}

export interface IsValidAuthorizationHeaderResponse {
  accessToken: string;
}

export const isValidAuthorizationHeader = (
  args: IsValidAuthorizationHeaderArgs
): Result<IsValidAuthorizationHeaderResponse> => {
  const { authorizationHeader } = args;

  // Check if authorization header is present
  if (!authorizationHeader) {
    // Missing authorization header
    return {
      success: false,
      error: new DetailedError(
        'invalid_request',
        'Missing authorization header.'
      ),
    };
  }

  // Check header format (Bearer <token>)
  const [type, token] = authorizationHeader.split(' ');

  if (type !== 'Bearer') {
    // Invalid header format
    return {
      success: false,
      error: new DetailedError(
        'invalid_request',
        'Invalid authorization header format.'
      ),
    };
  }

  // Check if access token is present
  if (!token) {
    // Invalid access token
    return {
      success: false,
      error: new DetailedError(
        'invalid_token',
        'Missing or invalid access token.'
      ),
    };
  }

  return {
    success: true,
    data: {
      accessToken: token,
    },
  };
};
