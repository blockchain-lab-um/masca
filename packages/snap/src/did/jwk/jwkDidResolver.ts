/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  DIDDocument,
  DIDResolutionOptions,
  DIDResolutionResult,
  DIDResolver,
  ParsedDID,
  Resolvable,
  JsonWebKey,
} from 'did-resolver';
import { decodeBase64url } from '@veramo/utils';
import { createTypeGuard, hasProperties } from 'create-typeguard';
import { base64urlEncode } from '../../utils/snapUtils';

const isJWK = createTypeGuard<JsonWebKey>((data) => {
  if (
    typeof data === 'object' &&
    data &&
    hasProperties(data, 'crv', 'kty', 'x', 'y')
  ) {
    const { crv, kty, x, y } = data;
    if (
      typeof crv === 'string' &&
      typeof kty === 'string' &&
      typeof x === 'string' &&
      typeof y === 'string'
    ) {
      return { crv, kty, x, y };
    }
  }
  return null;
});

function generateDidDocument(jwk: JsonWebKey): Promise<DIDDocument> {
  return new Promise((resolve, reject) => {
    try {
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
      resolve(didDocument);
    } catch (error) {
      reject(error);
    }
  });
}

function parseDidJwkIdentifier(didIdentifier: string): JsonWebKey {
  try {
    const jwk = JSON.parse(decodeBase64url(didIdentifier)) as JsonWebKey;
    if (!isJWK(jwk)) throw new Error();
    return jwk;
  } catch (error) {
    throw new Error('Invalid DID identifier');
  }
}

/* export const resolveSecp256k1 = async (
  snap: SnapsGlobalObject,
  account: string,
  didUrl: string
): Promise<DIDDocument> => {
  const state = await getSnapState(snap);
  const publicKey = await getPublicKey({
    snap,
    state,
    account,
    ethereum,
  });

  const jwk = generateJWKfromKey({
    publicKeyHex: publicKey,
  } as VerificationMethod);

  return generateDidDocument(jwk);
}; */

export const resolveDidJwk: DIDResolver = async (
  did: string,
  parsed: ParsedDID,
  resolver: Resolvable,
  options: DIDResolutionOptions
): Promise<DIDResolutionResult> => {
  try {
    if (parsed.method !== 'jwk') throw Error('Invalid DID method');

    const didIdentifier = did.split('did:jwk:')[1];
    if (!didIdentifier) throw Error('Invalid DID');

    const jwk = parseDidJwkIdentifier(didIdentifier);
    const didDocument = await generateDidDocument(jwk);

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
