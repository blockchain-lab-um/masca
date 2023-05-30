/* eslint-disable unused-imports/no-unused-vars */
import {
  createJWK,
  decodePublicKey,
  uint8ArrayToHex,
} from '@blockchain-lab-um/utils';
import { getResolver } from '@cef-ebsi/key-did-resolver';
import { convertPublicKeyToX25519 } from '@stablelib/ed25519';
import {
  Resolver,
  VerificationMethod,
  type DIDDocument,
  type DIDResolutionOptions,
  type DIDResolutionResult,
  type DIDResolver,
  type JsonWebKey,
  type ParsedDID,
  type Resolvable,
} from 'did-resolver';

import { checkDidComponents, getContext, getKeyType } from './keyDidUtils.js';
import type { DidComponents } from './types/keyDidTypes.js';

export const resolveDid = (did: string): Promise<DIDDocument> => {
  const components: DidComponents = checkDidComponents(did);
  const didIdentifier = components.multibaseValue;
  const didWithIdentifier = `did:key:${didIdentifier}#${didIdentifier}`;
  const publicKey = decodePublicKey(components.multibaseValue);
  const pk = uint8ArrayToHex(publicKey.pubKeyBytes);
  const keyType = getKeyType(publicKey.code);
  /* console.log(
    '🚀 ~ file: keyDidResolver.ts:61 ~ resolveDid ~ keyType:',
    keyType
  ); */
  let x25519Key: string;
  let verificationMethod;
  let keyAgreement;
  if (keyType === 'Ed25519') {
    x25519Key = uint8ArrayToHex(
      convertPublicKeyToX25519(publicKey.pubKeyBytes)
    );
    verificationMethod = {
      id: didWithIdentifier,
      type: 'Ed25519VerificationKey2020',
      controller: `did:key:${didIdentifier}`,
      publicKeyMultibase: didIdentifier,
    } as VerificationMethod;
    keyAgreement = {
      id: `${didWithIdentifier}#${x25519Key}`,
      type: 'X25519KeyAgreementKey2020',
      controller: `did:key:${didIdentifier}`,
      publicKeyMultibase: x25519Key,
    } as VerificationMethod;
  } else {
    const jwk = createJWK(keyType, pk) as JsonWebKey;
    if (!jwk) throw new Error('Cannot create JWK');
    verificationMethod = {
      id: didWithIdentifier,
      type: 'EcdsaSecp256k1VerificationKey2019',
      controller: `did:key:${didIdentifier}`,
      publicKeyJwk: jwk,
    } as VerificationMethod;
  }
  const didDocument: DIDDocument = {
    id: `did:key:${didIdentifier}`,
    '@context': ['https://www.w3.org/ns/did/v1', ...getContext(keyType)],
    assertionMethod: [didWithIdentifier],
    authentication: [didWithIdentifier],
    verificationMethod: [verificationMethod],
    ...(keyAgreement && { keyAgreement: [keyAgreement] }),
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
  'did:key:zQ3s': resolveDid, // Secp256k1
  'did:key:zDn': resolveDid, // P256
  'did:key:z6Mk': resolveDid, // Ed25519
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
