/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  DIDResolutionOptions,
  DIDResolutionResult,
  DIDResolver,
  ParsedDID,
  Resolvable,
} from 'did-resolver';
import { getDidKeyIdentifier } from './keyDidUtils';
import { getCurrentAccount, getPublicKey } from '../../utils/snapUtils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resolveSecp256k1 = async (did: string): Promise<any> => {
  const DID = await getDidKeyIdentifier();
  const account = await getCurrentAccount();
  const publicKey = await getPublicKey();
  const res = {
    didDocument: {
      '@context': [
        'https://www.w3.org/ns/did/v1',
        'https://w3id.org/security/suites/secp256k1-2019/v1',
      ],
      assertionMethod: [`${did}#${DID}`],
      authenticationMethod: [`${did}#${DID}`],
      capabilityInvocation: [`${did}#${DID}`],
      capabilityDelegation: [`${did}#${DID}`],
      keyAgreement: [`${did}#${DID}`],
      verificationMethod: [
        {
          id: `${did}#${DID}`,
          type: 'EcdsaSecp256k1RecoveryMethod2020',
          controller: `${did}#${DID}`,
          publicKeyHex: publicKey,
          blockchainAccountId: `${account}@eip155:4`,
        },
      ],
    },
  };
  console.log('Did doc', res);
  return res;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const startsWithMap: Record<string, Function> = {
  'did:key:zQ3s': resolveSecp256k1,
};

const resolveDidKey: DIDResolver = async (
  didUrl: string,
  _parsed: ParsedDID,
  _resolver: Resolvable,
  options: DIDResolutionOptions
): Promise<DIDResolutionResult> => {
  try {
    const startsWith = _parsed.did.substring(0, 12);
    if (startsWithMap[startsWith] !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const didResolution = await startsWithMap[startsWith](didUrl);
      return {
        didDocumentMetadata: {},
        didResolutionMetadata: {},
        ...didResolution,
      } as DIDResolutionResult;
    } else {
      return {
        didDocumentMetadata: {},
        didResolutionMetadata: {
          error: 'invalidDid',
          message: 'unsupported key type for did:key',
        },
        didDocument: null,
      };
    }
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
 * Provides a mapping to a did:key resolver, usable by {@link did-resolver#Resolver}.
 *
 * @public
 */
export function getDidKeyResolver() {
  return { key: resolveDidKey };
}
