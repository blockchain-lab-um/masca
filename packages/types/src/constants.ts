import { isIn } from '@blockchain-lab-um/utils';

/**
 * @description
 * Supported VC stores
 */
export const availableCredentialStores = ['snap', 'ceramic'] as const;
export type AvailableCredentialStores =
  (typeof availableCredentialStores)[number];
export const isavailableCredentialStores = (x: string) =>
  isIn<AvailableCredentialStores>(availableCredentialStores, x);

export const CURRENT_STATE_VERSION = "v1";

/**
 * @description
 *
 * Did methods requiring external signature
 * MetaMask personal_sign or eth_signTypedData_v4
 *
 * These methods use ethereum keys from MetaMask
 */
export const externalSigMethods = ['did:ethr', 'did:pkh'] as const;
export type ExternalSigMethods = (typeof externalSigMethods)[number];
export const isExternalSigMethods = (x: string) =>
  isIn<ExternalSigMethods>(externalSigMethods, x);

/**
 * @description
 *
 * Did methods supported by Veramo
 */
export const veramoSupportedMethods = [
  'did:ethr',
  'did:pkh',
  'did:key',
  'did:key:jwk_jcs-pub',
  'did:jwk',
  // 'did:ebsi',
] as const;
export type VeramoSupportedMethods = (typeof veramoSupportedMethods)[number];
export const isVeramoSupportedMethods = (x: string) =>
  isIn<VeramoSupportedMethods>(veramoSupportedMethods, x);

/**
 * @description
 *
 * Did methods supported by Polygon
 */
export const polygonSupportedMethods = ['did:iden3', 'did:polygonid'] as const;
export type PolygonSupportedMethods = (typeof polygonSupportedMethods)[number];
export const isPolygonSupportedMethods = (x: string) =>
  isIn<PolygonSupportedMethods>(polygonSupportedMethods, x);

/**
 * @description
 *
 * Did methods we can use to sign data internally
 */
export const internalSigMethods = [
  'did:key',
  'did:key:jwk_jcs-pub',
  'did:jwk',
  ...polygonSupportedMethods,
] as const;
export type InternalSigMethods = (typeof internalSigMethods)[number];
export const isInternalSigMethods = (x: string) =>
  isIn<InternalSigMethods>(internalSigMethods, x);

/**
 * @description
 * All supported methods
 */
export const availableMethods = [
  ...externalSigMethods,
  ...internalSigMethods,
] as const;
export type AvailableMethods = (typeof availableMethods)[number];
export const isAvailableMethods = (x: string) =>
  isIn<AvailableMethods>(availableMethods, x);

/**
 * @description
 * Methods requiring a specific network
 */
export type MethodsRequiringNetwork = (typeof externalSigMethods)[number];
export const requiresNetwork = (x: string) =>
  isIn<MethodsRequiringNetwork>(externalSigMethods, x);

/**
 * @description
 * Supported networks for selected methods, '*' means all networks
 * Explore networks here: https://chainlist.org/
 */
export const didMethodChainIdMapping: Record<
  MethodsRequiringNetwork,
  readonly string[]
> = {
  'did:ethr': ['*'],
  'did:pkh': ['0x1', '0x89'],
} as const;

/**
 * @description
 * This mapping is used for entropy based account derivation
 *
 * in the path: m / purpose' / coin_type' / account' / change / address_index, our indices
 * are used as account', later on, address_index will be used for key rotation
 *
 * @see https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#path-levels for more info on BIP44
 */
export const methodIndexMapping: Record<InternalSigMethods, number> = {
  'did:key': 0,
  'did:key:jwk_jcs-pub': 0,
  'did:jwk': 1,
  'did:iden3': 2,
  'did:polygonid': 3,
} as const;

export const supportedProofFormats = [
  'jwt',
  'lds',
  'EthereumEip712Signature2021',
] as const;

export type SupportedProofFormats = (typeof supportedProofFormats)[number];

export const isSupportedProofFormat = (x: string) =>
  isIn<SupportedProofFormats>(supportedProofFormats, x);
