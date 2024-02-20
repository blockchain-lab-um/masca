import { IIdentifier } from '@veramo/core';
import { Signer } from 'did-jwt';
import {
  createVerifiableCredentialJwt,
  Issuer,
  JwtCredentialPayload,
  normalizeCredential,
} from 'did-jwt-vc';

import { CREDENTIAL_DATA } from './constants';
import { Agent } from './createVeramoAgent';

export const createJWTCredential = async (
  agent: Agent,
  identifier: IIdentifier,
  options?: Partial<JwtCredentialPayload>
) => {
  const payload: JwtCredentialPayload = {
    issuanceDate: new Date().toISOString(),
    sub: CREDENTIAL_DATA.credentialSubject.id,
    vc: CREDENTIAL_DATA,
    ...options,
  };

  const signer: Signer = async (data: string | Uint8Array) =>
    agent.keyManagerSign({
      keyRef: identifier.keys[0].kid,
      data: data as string,
    });

  const issuer: Issuer = {
    did: identifier.did,
    signer,
  };

  const credentialJWT = await createVerifiableCredentialJwt(payload, issuer, {
    removeOriginalFields: true,
  });

  return normalizeCredential(credentialJWT);
};
