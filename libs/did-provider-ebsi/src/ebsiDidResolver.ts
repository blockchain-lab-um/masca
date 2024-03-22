import { getResolver } from '@cef-ebsi/ebsi-did-resolver';
import {
  type DIDResolutionOptions,
  type DIDResolutionResult,
  type DIDResolver,
  type ParsedDID,
  type Resolvable,
  Resolver,
} from 'did-resolver';

import { EbsiConfig } from './constants.js';

const resolveDidEbsi: DIDResolver = async (
  did: string,
  _parsed: ParsedDID,
  _resolver: Resolvable,
  _options: DIDResolutionOptions
): Promise<DIDResolutionResult> => {
  try {
    const resolverConfig = {
      registry: EbsiConfig.DID_REGISTRY,
    };
    const ebsiResolver = getResolver(resolverConfig);
    const didResolver = new Resolver(ebsiResolver);

    const didResolution = await didResolver.resolve(did);
    return didResolution;
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
 * Provides a mapping to a did:ebsi resolver, usable by {@link did-resolver#Resolver}.
 *
 * @public
 */
export function ebsiDidResolver() {
  return { ebsi: resolveDidEbsi };
}
