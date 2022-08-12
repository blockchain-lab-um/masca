/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  DIDResolutionOptions,
  DIDResolutionResult,
  DIDResolver,
  ParsedDID,
  Resolvable,
} from "did-resolver";
import { _getDidKeyIdentifier } from "../../utils/snap_utils";
import { getCurrentAccount } from "../../utils/snap_utils";

const resolveSecp256k1 = async (did: string): Promise<any> => {
  const { didUrl, pubKey, compressedKey } = await _getDidKeyIdentifier();
  const account = await getCurrentAccount();
  const res = {
    didDocument: {
      "@context": [
        "https://www.w3.org/ns/did/v1",
        "https://w3id.org/security/suites/secp256k1-2019/v1",
      ],
      assertionMethod: [did],
      authenticationMethod: [did],
      capabilityInvocation: [did],
      capabilityDelegation: [did],
      keyAgreement: [did],
      verificationMethod: [
        {
          id: `${did}#${didUrl}`,
          type: "EcdsaSecp256k1RecoveryMethod2020",
          controller: did,
          publicKeyHex: compressedKey,
          blockchainAccountId: `${account}@eip155:4`,
        },
      ],
    },
  };

  return res;
};

export const startsWithMap: Record<string, Function> = {
  "did:key:zQ3s": resolveSecp256k1,
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
      const didResolution = await startsWithMap[startsWith](didUrl);
      return {
        didDocumentMetadata: {},
        didResolutionMetadata: {},
        ...didResolution,
      };
    } else {
      return {
        didDocumentMetadata: {},
        didResolutionMetadata: {
          error: "invalidDid",
          message: "unsupported key type for did:key",
        },
        didDocument: null,
      };
    }
  } catch (err: any) {
    return {
      didDocumentMetadata: {},
      didResolutionMetadata: { error: "invalidDid", message: err.toString() },
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
