import type { IIdentifier } from '@veramo/core';
import type { Signer } from 'did-jwt';
import {
  type Issuer,
  type JwtPresentationPayload,
  createVerifiablePresentationJwt,
  normalizePresentation,
} from 'did-jwt-vc';

import type { Agent } from './createVeramoAgent';

export const createJWTPresentation = async (
  agent: Agent,
  identifier: IIdentifier,
  credentials: any[],
  options?: Partial<JwtPresentationPayload>
) => {
  const payload: JwtPresentationPayload = {
    vp: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiablePresentation'],
      verifiableCredential: credentials,
    },
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

  const credentialJWT = await createVerifiablePresentationJwt(payload, issuer, {
    removeOriginalFields: true,
  });

  return normalizePresentation(credentialJWT);
};
