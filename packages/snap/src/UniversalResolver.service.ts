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
    const response = await fetch(`${UNIRESOLVER_PROXY_URL}/${did}`);
    const data = (await response.json()) as DIDResolutionResult;
    return data;
  } catch (e) {
    return {
      didDocument: null,
      didDocumentMetadata: {},
      didResolutionMetadata: {
        error: 'couldnt resolve did',
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
