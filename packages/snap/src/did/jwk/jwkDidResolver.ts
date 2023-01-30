/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  DIDDocument,
  DIDResolutionOptions,
  DIDResolutionResult,
  DIDResolver,
  ParsedDID,
  Resolvable,
  VerificationMethod,
  JsonWebKey,
} from 'did-resolver';
import { SnapsGlobalObject } from '@metamask/snaps-types';
import { decodeBase64url } from '@veramo/utils';
import {
  base64urlEncode,
  getCurrentAccount,
  getPublicKey,
} from '../../utils/snapUtils';
import { getSnapState } from '../../utils/stateUtils';
import { generateJWKfromKey } from './jwkDidUtils';

function generateDidDocument(jwk: JsonWebKey): DIDDocument {
  const did = `did:jwk:${base64urlEncode(JSON.stringify(jwk))}`;
  const didDocument: DIDDocument = {
    id: did,
    '@context': [
      'https://www.w3.org/ns/did/v1',
      'https://w3id.org/security/suites/jws-2020/v1',
    ],
    verificationMethod: [
      {
        id: `${did}#0`,
        type: 'JsonWebKey2020',
        controller: did,
        publicKeyJwk: jwk,
      },
    ],
    assertionMethod: [`${did}#0`],
    authentication: [`${did}#0`],
    capabilityInvocation: [`${did}#0`],
    capabilityDelegation: [`${did}#0`],
    keyAgreement: [`${did}#0`],
  };
  return didDocument;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const resolveSecp256k1 = async (
  snap: SnapsGlobalObject,
  account: string,
  didUrl: string
): Promise<DIDDocument> => {
  const state = await getSnapState(snap);
  const publicKey = await getPublicKey({ snap, state, account });

  const jwk = generateJWKfromKey({
    publicKeyHex: publicKey,
  } as VerificationMethod);

  return generateDidDocument(jwk);
};

export const resolveDidJwk: DIDResolver = async (
  did: string,
  parsed: ParsedDID,
  resolver: Resolvable,
  options: DIDResolutionOptions
): Promise<DIDResolutionResult> => {
  try {
    const didIdentifier = did.split('did:jwk:')[1];
    if (!didIdentifier) throw Error('Invalid DID');
    const jwk = JSON.parse(decodeBase64url(didIdentifier)) as JsonWebKey;

    const account = await getCurrentAccount(snap);
    if (!account) throw Error('User denied error');

    const didDocument = await resolveSecp256k1(snap, account, did);
    return {
      didDocumentMetadata: {},
      didResolutionMetadata: {},
      didDocument,
    } as DIDResolutionResult;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return {
      didDocumentMetadata: {},
      didResolutionMetadata: {
        error: 'invalidDid',
        message: (err as string).toString(),
      },
      didDocument: null,
    };
  }
};

/**
 * Provides a mapping to a did:jwk resolver, usable by {@link did-resolver#Resolver}.
 *
 * @public
 */
export function getDidJwkResolver() {
  return { jwk: resolveDidJwk };
}
