/* eslint-disable unused-imports/no-unused-vars */
import { decodePublicKey } from '@blockchain-lab-um/utils';
import { getResolver } from '@cef-ebsi/key-did-resolver';
import {
  Resolver,
  type DIDDocument,
  type DIDResolutionOptions,
  type DIDResolutionResult,
  type DIDResolver,
  type ParsedDID,
  type Resolvable,
} from 'did-resolver';

import { curveResolverMap } from './curves.js';
import { checkDidComponents, getKeyType } from './keyDidUtils.js';
import type { DidComponents } from './types/keyDidTypes.js';

export const resolveDid = (did: string): Promise<DIDDocument> => {
  const components: DidComponents = checkDidComponents(did);
  const didIdentifier = components.multibaseValue;
  const publicKey = decodePublicKey(components.multibaseValue);
  const keyType = getKeyType(publicKey.code);

  if (!curveResolverMap[keyType])
    throw new Error('invalidDid: invalid key type');
  return curveResolverMap[keyType]({ didIdentifier, publicKey, keyType });
};

export const resolveSecp256k1Ebsi = async (
  did: string
): Promise<DIDDocument> => {
  const keyResolver = getResolver();
  const didResolver = new Resolver(keyResolver);
  const resolution = await didResolver.resolve(did);
  return resolution.didDocument as DIDDocument;
};

type ResolutionFunction = (did: string) => Promise<DIDDocument>;

const startsWithMap: Record<string, ResolutionFunction> = {
  'did:key:zQ3s': resolveDid, // Secp256k1
  'did:key:zDn': resolveDid, // P256
  'did:key:z6Mk': resolveDid, // Ed25519
  'did:key:z2dm': resolveSecp256k1Ebsi,
  'did:key:zBhB': resolveSecp256k1Ebsi,
};

const startsWithMapCurve: Record<string, string> = {
  'did:key:zQ3s': 'secp256k1',
  'did:key:z2dm': 'secp256k1Ebsi',
  'did:key:zBhB': 'secp256k1Ebsi',
  'did:key:z6Mk': 'ed25519',
  'did:key:z6LS': 'x25519',
  'did:key:zDn': 'p256', // Secp256r1
};

export const resolveDidKey: DIDResolver = async (
  didUrl: string,
  parsed: ParsedDID,
  resolver: Resolvable,
  options: DIDResolutionOptions
): Promise<DIDResolutionResult> => {
  try {
    const startsWith = parsed.did.substring(0, 12);
    if (startsWithMap[startsWith] !== undefined) {
      const didDocument = await startsWithMap[startsWith](didUrl);
      return {
        didDocumentMetadata: {},
        didResolutionMetadata: {},
        didDocument,
      } as DIDResolutionResult;
    }

    return {
      didDocumentMetadata: {},
      didResolutionMetadata: {
        error: 'invalidDid',
        message: 'unsupported key type for did:key',
      },
      didDocument: null,
    };
  } catch (err: unknown) {
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
 * Provides a mapping to a did:key resolver, usable by {@link did-resolver#Resolver}.
 *
 * @public
 */
export function getMascaDidKeyResolver() {
  return { key: resolveDidKey };
}
