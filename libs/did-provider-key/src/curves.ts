import { createJWK, uint8ArrayToHex } from '@blockchain-lab-um/utils';
import { convertPublicKeyToX25519 } from '@stablelib/ed25519';
import { DIDDocument, VerificationMethod } from 'did-resolver';

import { CurveResolutionFunction, IResolveDidParams } from './index.js';

export function buildDidDoc(
  didIdentifier: string,
  context: string[],
  verificationMethod: VerificationMethod,
  keyAgreement?: VerificationMethod
): DIDDocument {
  const didDocument: DIDDocument = {
    id: `did:key:${didIdentifier}`,
    '@context': ['https://www.w3.org/ns/did/v1', ...context],
    assertionMethod: [`did:key:${didIdentifier}#${didIdentifier}`],
    authentication: [`did:key:${didIdentifier}#${didIdentifier}`],
    verificationMethod: [verificationMethod],
    ...(keyAgreement && { keyAgreement: [keyAgreement] }),
  };
  return didDocument;
}

export function resolveSecp256k1(
  params: IResolveDidParams
): Promise<DIDDocument> {
  const { publicKey, keyType, didIdentifier } = params;
  const pk = uint8ArrayToHex(publicKey.pubKeyBytes);
  const jwk = createJWK(keyType, pk) as JsonWebKey;
  if (!jwk) throw new Error('Cannot create JWK');
  const verificationMethod = {
    id: `did:key:${didIdentifier}#${didIdentifier}`,
    type: 'EcdsaSecp256k1VerificationKey2019',
    controller: `did:key:${didIdentifier}`,
    publicKeyJwk: jwk,
  } as VerificationMethod;
  const context = [
    'https://w3id.org/security#EcdsaSecp256k1VerificationKey2019',
    'https://w3id.org/security#publicKeyJwk',
  ];
  return new Promise((resolve) => {
    resolve(buildDidDoc(didIdentifier, context, verificationMethod));
  });
}

export function resolveEd25519(
  params: IResolveDidParams
): Promise<DIDDocument> {
  const { publicKey, didIdentifier } = params;
  const x25519Key = uint8ArrayToHex(
    convertPublicKeyToX25519(publicKey.pubKeyBytes)
  );
  const verificationMethod = {
    id: `did:key:${didIdentifier}#${didIdentifier}`,
    type: 'Ed25519VerificationKey2020',
    controller: `did:key:${didIdentifier}`,
    publicKeyMultibase: didIdentifier,
  } as VerificationMethod;
  const keyAgreement = {
    id: `did:key:${didIdentifier}#${x25519Key}`,
    type: 'X25519KeyAgreementKey2020',
    controller: `did:key:${didIdentifier}`,
    publicKeyMultibase: x25519Key,
  } as VerificationMethod;
  const context = [
    'https://w3id.org/security/suites/ed25519-2020/v1',
    'https://w3id.org/security/suites/x25519-2020/v1',
  ];
  return new Promise((resolve) => {
    resolve(
      buildDidDoc(didIdentifier, context, verificationMethod, keyAgreement)
    );
  });
}

export const curveResolverMap: Record<string, CurveResolutionFunction> = {
  Secp256k1: resolveSecp256k1,
  Ed25519: resolveEd25519,
};
