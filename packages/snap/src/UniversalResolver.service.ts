import {
  DIDResolutionOptions,
  DIDResolutionResult,
  ParsedDID,
  Resolvable,
} from 'did-resolver';

const resolveDid = async (
  did: string,
  _parsed: ParsedDID,
  _resolver: Resolvable,
  _options: DIDResolutionOptions
): Promise<DIDResolutionResult> => {
  try {
    const response = await fetch(
      `https://dev.uniresolver.io/1.0/identifiers/${did}`
    );
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
