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
import { base64urlEncode } from '../../utils/snapUtils';

const isJWK = (data: unknown): data is JsonWebKey => {
  if (
    typeof data === 'object' &&
    data &&
    'crv' in data &&
    typeof data.crv === 'string' &&
    'kty' in data &&
    typeof data.kty === 'string' &&
    'x' in data &&
    typeof data.x === 'string' &&
    'y' in data &&
    typeof data.y === 'string'
  ) {
    return true;
  }

  return false;
};

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
    const jwk = JSON.parse(decodeBase64url(didIdentifier)) as unknown;
    if (!isJWK(jwk)) {
      throw new Error("DID identifier doesn't contain a valid JWK");
    }

    return jwk;
  } catch (error) {
    throw new Error('Invalid DID identifier');
  }
}

export const resolveDidJwk: DIDResolver = async (
  did: string,
  parsed: ParsedDID,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  resolver: Resolvable,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
