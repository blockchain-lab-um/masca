/* eslint-disable unused-imports/no-unused-vars */
import { uint8ArrayToHex } from '@blockchain-lab-um/utils';
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
import { varint } from 'multiformats';
import { base58btc } from 'multiformats/bases/base58';

import type { DidComponents } from './types/keyDidTypes.js';

export function checkDidComponents(did: string): DidComponents {
  const components = did.split(':');
  if (components.length === 3) {
    components.splice(2, 0, '1');
  }
  const [scheme, method, version, multibaseValue] = components;
  if (components.length !== 4 && components.length !== 3) {
    throw new Error('invalidDid: invalid number of components');
  }
  if (scheme !== 'did' || method !== 'key') {
    throw new Error('invalidDid: invalid scheme or method');
  }
  const parsedVersion = parseInt(version, 10);
  if (Number.isNaN(parsedVersion) || parsedVersion <= 0) {
    throw new Error('invalidDid: invalid version');
  }
  if (multibaseValue.length === 0 || !multibaseValue.startsWith('z')) {
    throw new Error('invalidDid: invalid multibase value');
  }
  const didComponents: DidComponents = {
    scheme,
    method,
    version,
    multibaseValue,
  };
  return didComponents;
}

export const decodePublicKey = (publicKey: string) => {
  const multicodecPubKey = base58btc.decode(publicKey);
  const [code, sizeOffset] = varint.decode(multicodecPubKey);
  const pubKeyBytes = multicodecPubKey.slice(sizeOffset);

  return {
    pubKeyBytes,
    code,
  };
};

export const resolveDid = (did: string): Promise<DIDDocument> => {
  const components: DidComponents = checkDidComponents(did);
  const didIdentifier = components.multibaseValue;
  const didWithIdentifier = `did:key:${didIdentifier}#${didIdentifier}`;
  const publicKey = decodePublicKey(components.multibaseValue);
  const pk = uint8ArrayToHex(publicKey.pubKeyBytes);
  console.log('🚀 ~ file: keyDidResolver.ts:63 ~ resolveSecp256k1 ~ pk:', pk);
  const didDocument: DIDDocument = {
    id: `did:key:${didIdentifier}`,
    '@context': [
      'https://www.w3.org/ns/did/v1',
      'https://w3id.org/security/suites/secp256k1-2019/v1',
    ],
    assertionMethod: [didWithIdentifier],
    authentication: [didWithIdentifier],
    verificationMethod: [
      {
        id: didWithIdentifier,
        type: 'EcdsaSecp256k1RecoveryMethod2020',
        controller: `did:key:${didIdentifier}`,
        publicKeyHex: pk,
      },
    ],
  };
  return new Promise((resolve) => {
    resolve(didDocument);
  });
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
  'did:key:zQ3s': resolveDid,
  'did:key:z2dm': resolveSecp256k1Ebsi,
  'did:key:zBhB': resolveSecp256k1Ebsi,
};

const startsWithMapCurve: Record<string, string> = {
  'did:key:zQ3s': 'secp256k1',
  'did:key:z2dm': 'secp256k1',
  'did:key:zBhB': 'secp256k1',
  'did:key:zDn': 'p256',
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
