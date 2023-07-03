/**
 * Provides `did:key` {@link @veramo/did-provider-key#KeyDIDProvider | identifier provider } for the
 * {@link @veramo/did-manager#DIDManager}, extended with EBSI specific functionality (jwk_jcs-pub multicodec)
 *
 * @packageDocumentation
 */
export { KeyDIDProvider } from './keyDidProvider.js';
export { getDidKeyResolver } from './keyDidResolver.js';
export * from './keyDidUtils.js';
export * from './types/keyDidTypes.js';
