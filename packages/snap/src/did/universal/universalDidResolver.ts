import {
  DIDResolutionOptions,
  DIDResolutionResult,
  DIDResolver,
  ParsedDID,
  Resolvable,
} from 'did-resolver';

export const resolveDid: DIDResolver = async (
  did: string,
  parsed: ParsedDID,
  resolver: Resolvable,
  options: DIDResolutionOptions
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

export function getUniversalDidResolver() {
  return {
    ens: resolveDid,
    ion: resolveDid,
    ebsi: resolveDid,
    web: resolveDid,
    github: resolveDid,
    cheqd: resolveDid,
    polygonid: resolveDid,
  };
}
