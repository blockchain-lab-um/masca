import type { JSONObject } from '@0xpolygonid/js-sdk';

export interface JWTHeader {
  typ?: string;
  alg?: string;

  [x: string]: any;
}

export interface JWTPayload {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  iat?: number;
  nbf?: number;
  exp?: number;
  rexp?: number;

  [x: string]: any;
}

export interface JWTData {
  header?: JWTHeader;
  payload?: JWTPayload;
}

export interface SignJWTParams {
  type: 'JWT';
  data?: JWTData;
}

export interface SignJWZParams {
  type: 'JWZ';
  data: JSONObject;
}
