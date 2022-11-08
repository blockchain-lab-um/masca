/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  DIDDocument,
  DIDResolutionOptions,
  DIDResolutionResult,
  DIDResolver,
  ParsedDID,
  Resolvable,
} from 'did-resolver';
import { getDidKeyIdentifier } from './keyDidUtils';
import { getCurrentAccount, getPublicKey } from '../../utils/snapUtils';
import { SnapProvider } from '@metamask/snap-types';
import { getSnapState } from '../../utils/stateUtils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const resolveSecp256k1 = async (
  wallet: SnapProvider,
  account: string,
  did: string
): Promise<DIDDocument> => {
  const state = await getSnapState(wallet);
  const DID = getDidKeyIdentifier(state, account);
  const publicKey = await getPublicKey({ wallet, state, account });

  // TODO: Change id ?
  const didDocument: DIDDocument = {
    id: `did:key:${did}#${DID}`,
    '@context': [
      'https://www.w3.org/ns/did/v1',
      'https://w3id.org/security/suites/secp256k1-2019/v1',
    ],
    assertionMethod: [`did:key:${did}#${DID}`],
    authentication: [`did:key:${did}#${DID}`],
    capabilityInvocation: [`did:key:${did}#${DID}`],
    capabilityDelegation: [`did:key:${did}#${DID}`],
    keyAgreement: [`did:key:${did}#${DID}`],
    verificationMethod: [
      {
        id: `did:key:${did}#${DID}`,
        type: 'EcdsaSecp256k1RecoveryMethod2020',
        controller: `did:key:${did}#${DID}`,
        publicKeyHex: publicKey.split('0x')[1],
      },
    ],
  };
  console.log('Did doc', didDocument);
  return didDocument;
};

type ResolutionFunction = (
  wallet: SnapProvider,
  account: string,
  did: string
) => Promise<DIDDocument>;

const startsWithMap: Record<string, ResolutionFunction> = {
  'did:key:zQ3s': resolveSecp256k1,
};

// FIXME: CHECK HOW WE COULD ADD WALLET AS PARAMETER
export const resolveDidKey: DIDResolver = async (
  didUrl: string,
  parsed: ParsedDID,
  resolver: Resolvable,
  options: DIDResolutionOptions
): Promise<DIDResolutionResult> => {
  try {
    // FIXME: Update this part
    const account = await getCurrentAccount(wallet);
    if (!account) throw Error('User denied error');
    // --------

    const startsWith = parsed.did.substring(0, 12);
    if (startsWithMap[startsWith] !== undefined) {
      const didDocument = await startsWithMap[startsWith](
        wallet,
        account,
        didUrl
      );
      return {
        didDocumentMetadata: {},
        didResolutionMetadata: {},
        didDocument: didDocument,
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
