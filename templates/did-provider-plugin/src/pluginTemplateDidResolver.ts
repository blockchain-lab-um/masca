import {
  DIDResolutionOptions,
  DIDResolutionResult,
  DIDResolver,
  ParsedDID,
  Resolvable,
} from 'did-resolver';

const resolveDidPluginTemplate: DIDResolver = async (
  _did: string,
  _parsed: ParsedDID,
  _resolver: Resolvable,
  _options: DIDResolutionOptions
): Promise<DIDResolutionResult> => {
  try {
    // resolve
    const didResolution = {};
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return didResolution as DIDResolutionResult;
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
 * Provides a mapping to a did:pluginTemplate resolver, usable by {@link did-resolver#Resolver}.
 *
 * @public
 */
export function pluginTemplateDidResolver() {
  return { pluginTemplate: resolveDidPluginTemplate };
}
