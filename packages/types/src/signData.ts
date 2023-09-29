export interface JWTHeader {
  typ: 'JWT';
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
  header: JWTHeader;
  payload: JWTPayload;
}

export interface JWTOptions {
  hash: 'sha256' | 'keccak';
}

export interface SignJWTParams {
  type: 'JWT';
  data: JWTData;
  options: JWTOptions;
}

export interface SignJWZParams {
  type: 'JWZ';
  data: string;
}
