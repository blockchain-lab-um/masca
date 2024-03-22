import type {
  VerifiableCredential,
  VerifiablePresentation,
} from '@veramo/core';

import { readJSON } from '../utils/readJSON';

export const CREDENTIAL_VALID_JWT = readJSON(
  import.meta.url,
  'credential_valid_jwt.json'
) as VerifiableCredential;
export const CREDENTIAL_VALID_EIP712 = readJSON(
  import.meta.url,
  'credential_valid_eip712.json'
) as VerifiableCredential;
export const CREDENTIAL_VALID_JWT_EXP_NBF = readJSON(
  import.meta.url,
  'credential_valid_jwt_exp_nbf.json'
) as VerifiableCredential;
export const CREDENTIAL_INVALID_JWT_EXP = readJSON(
  import.meta.url,
  'credential_invalid_jwt_exp.json'
) as VerifiableCredential;
export const CREDENTIAL_INVALID_JWT_NBF = readJSON(
  import.meta.url,
  'credential_invalid_jwt_nbf.json'
) as VerifiableCredential;
export const CREDENTIAL_INVALID_JWT_SIGNATURE = readJSON(
  import.meta.url,
  'credential_invalid_jwt_signature.json'
) as VerifiableCredential;
export const CREDENTIAL_INVALID_JWT_SCHEMA = readJSON(
  import.meta.url,
  'credential_invalid_jwt_schema.json'
) as VerifiableCredential;
export const CREDENTIAL_INVALID_EIP712_SIGNATURE = readJSON(
  import.meta.url,
  'credential_invalid_eip712_signature.json'
) as VerifiableCredential;
export const PRESENTATION_VALID_JWT = readJSON(
  import.meta.url,
  'presentation_valid_jwt.json'
) as VerifiablePresentation;
export const PRESENTATION_VALID_EIP712 = readJSON(
  import.meta.url,
  'presentation_valid_eip712.json'
) as VerifiablePresentation;
export const PRESENTATION_VALID_JWT_CREDENTIAL_EIP712 = readJSON(
  import.meta.url,
  'presentation_valid_jwt_credential_eip712.json'
) as VerifiablePresentation;
export const PRESENTATION_VALID_EIP712_CREDENTIAL_JWT = readJSON(
  import.meta.url,
  'presentation_valid_eip712_credential_jwt.json'
) as VerifiablePresentation;
export const PRESENTATION_VALID_JWT_CREDENTIAL_JWT_EIP712 = readJSON(
  import.meta.url,
  'presentation_valid_jwt_credential_jwt_eip712.json'
) as VerifiablePresentation;
export const PRESENTATION_VALID_EIP712_CREDENTIAL_JWT_EIP712 = readJSON(
  import.meta.url,
  'presentation_valid_eip712_credential_jwt_eip712.json'
) as VerifiablePresentation;
export const PRESENTATION_VALID_JWT_EXP_NBF = readJSON(
  import.meta.url,
  'presentation_valid_jwt_exp_nbf.json'
) as VerifiablePresentation;
export const PRESENTATION_INVALID_JWT_SIGNATURE = readJSON(
  import.meta.url,
  'presentation_invalid_jwt_signature.json'
) as VerifiablePresentation;
export const PRESENTATION_INVALID_EIP712_SIGNATURE = readJSON(
  import.meta.url,
  'presentation_invalid_eip712_signature.json'
) as VerifiablePresentation;
export const PRESENTATION_INVALID_JWT_CREDENTIAL_EIP712_SIGNATURE = readJSON(
  import.meta.url,
  'presentation_invalid_jwt_credential_eip712_signature.json'
) as VerifiablePresentation;
export const PRESENTATION_INVALID_JWT_NBF = readJSON(
  import.meta.url,
  'presentation_invalid_jwt_nbf.json'
) as VerifiablePresentation;
export const PRESENTATION_INVALID_JWT_EXP = readJSON(
  import.meta.url,
  'presentation_invalid_jwt_exp.json'
) as VerifiablePresentation;
export const PRESENTATION_INVALID_JWT_CREDENTIAL_EXPIRED = readJSON(
  import.meta.url,
  'presentation_invalid_jwt_credential_expired.json'
) as VerifiablePresentation;
export const PRESENTATION_INVALID_JWT_CREDENTIAL_EIP712_CREDENTIAL_JWT_EXPIRED =
  readJSON(
    import.meta.url,
    'presentation_invalid_jwt_credential_eip712_credential_jwt_expired.json'
  ) as VerifiablePresentation;
