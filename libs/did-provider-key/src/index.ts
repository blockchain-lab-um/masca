/**
 * Provides `did:key` {@link @veramo/did-provider-key#KeyDIDProvider | identifier provider } for the
 * {@link @veramo/did-manager#DIDManager}, extended with EBSI specific functionality
 *
 * @packageDocumentation
 */
export { MascaKeyDidProvider } from './keyDidProvider.js';
export { getMascaDidKeyResolver } from './keyDidResolver.js';
export * from './keyDidUtils.js';
export * from './types/keyDidTypes.js';
