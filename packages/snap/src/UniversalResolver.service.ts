import {
  DIDResolutionOptions,
  DIDResolutionResult,
  ParsedDID,
  Resolvable,
} from 'did-resolver';

import { UNIRESOLVER_PROXY_URL } from './utils/config';

/**
 * Function that resolves a DID string using the universal resolver
 * @returns DIDResolutionResult
 */
const resolveDid = async (
  did: string,
  _parsed: ParsedDID,
  _resolver: Resolvable,
  _options: DIDResolutionOptions
): Promise<DIDResolutionResult> => {
  try {
    const response = await fetch(`${UNIRESOLVER_PROXY_URL}/${did}`, {
      signal: AbortSignal.timeout(15000),
    });
    const data = (await response.json()) as DIDResolutionResult;
    return data;
  } catch (e) {
    let errorMsg = 'Failed to resolve DID Document';
    if (typeof e === 'string') {
      errorMsg = e;
    }
    if ((e as Error).message && typeof (e as Error).message === 'string') {
      errorMsg = (e as Error).message;
    }
    return {
      didDocument: null,
      didDocumentMetadata: {},
      didResolutionMetadata: {
        error: errorMsg,
      },
    };
  }
};

class UniversalResolverService {
  static getResolver() {
    return {
      ens: resolveDid,
      ion: resolveDid,
      ebsi: resolveDid,
      web: resolveDid,
      github: resolveDid,
      cheqd: resolveDid,
    };
  }
}

export default UniversalResolverService;
