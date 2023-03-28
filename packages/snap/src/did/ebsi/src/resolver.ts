import { getResolver } from '@cef-ebsi/ebsi-did-resolver';
import {
  DIDResolutionOptions,
  DIDResolutionResult,
  DIDResolver,
  ParsedDID,
  Resolvable,
  Resolver,
} from 'did-resolver';

import { EbsiConfig } from './constants';

const resolveDidEbsi: DIDResolver = async (
  did: string,
  parsed: ParsedDID,
  resolver: Resolvable,
  options: DIDResolutionOptions
): Promise<DIDResolutionResult> => {
  try {
    const resolverConfig = {
      registry: EbsiConfig.DID_REGISTRY,
    };
    const ebsiResolver = getResolver(resolverConfig);
    const didResolver = new Resolver(ebsiResolver);

    const didResolution = await didResolver.resolve(did);
    return didResolution;
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
 * Provides a mapping to a did:ebsi resolver, usable by {@link did-resolver#Resolver}.
 *
 * @public
 */
export function ebsiDidResolver() {
  return { ebsi: resolveDidEbsi };
}
