const BASE_URL = 'https://api-pilot.ebsi.eu';
const DID_REGISTRY = `${BASE_URL}/did-registry/v3/identifiers`;
const TAR_REG = `${BASE_URL}/trusted-apps-registry/v3/apps`;

const AUTH_RESPONSE = '/users-onboarding/v2/authentication-responses';
const SIOP_SESSIONS = '/authorisation/v2/siop-sessions';
const DID_REGISTRY_RPC = '/did-registry/v3/jsonrpc';

export const EbsiConfig = {
  BASE_URL,
  DID_REGISTRY,
  TAR_REG,
};

export const EbsiEndpoints = {
  AUTH_RESPONSE,
  SIOP_SESSIONS,
  DID_REGISTRY_RPC,
};
