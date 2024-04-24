import type {
  DIDResolutionOptions,
  DIDResolutionResult,
  ParsedDID,
  Resolvable,
} from 'did-resolver';

export class UniversalResolverService {
  static universalResolverUrl: string | null = null;

  static init(universalResolverUrl = 'https://masca.io/api/proxy/uniresolver') {
    UniversalResolverService.universalResolverUrl = universalResolverUrl;
  }

  /**
   * Function that resolves a DID string using the universal resolver
   * @returns DIDResolutionResult
   */
  static resolveDid = async (
    did: string,
    _parsed: ParsedDID,
    _resolver: Resolvable,
    _options: DIDResolutionOptions
  ): Promise<DIDResolutionResult> => {
    try {
      const response = await fetch(
        `${UniversalResolverService.universalResolverUrl}/${did}`,
        {
          signal: AbortSignal.timeout(15000),
        }
      );
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

  static getResolver() {
    return {
      ens: UniversalResolverService.resolveDid,
      ion: UniversalResolverService.resolveDid,
      ebsi: UniversalResolverService.resolveDid,
      web: UniversalResolverService.resolveDid,
      github: UniversalResolverService.resolveDid,
      cheqd: UniversalResolverService.resolveDid,
    };
  }
}
