import { EbsiVerifiablePresentation } from '@cef-ebsi/verifiable-presentation';
import { JWK } from 'jose';

export type IRequestVerifiableAuthorizationArgs = {
  /**
   * JWT encoded id token
   */
  idTokenJwt: string;
  /**
   * Bearer token needed for authorization
   */
  bearer: string;
};

export type IVerifiableAuthorization = {
  /**
   * JWT encoded Verifiable Authorization
   */
  verifiableCredential: string;
};

export type IVerifiablePresentation = {
  /**
   * JWT encoded Verifiable Presentation
   */
  jwtVp: string;
  /**
   * Payload of the Verifiable Presentation
   */
  payload: EbsiVerifiablePresentation;
};

export type ISession = {
  /**
   * Encrypted payload with user's public key
   */
  ake1_enc_payload: string;
  /**
   * Encrypted payload with user's public key
   */
  ake1_sig_payload: ISIOPSessionPayload;
  /**
   * Detached JWS of AKE1 Signing Payload
   */
  ake1_jws_detached: string;
  /**
   * API KID
   */
  kid: string;
};

export type IKeyJwks = {
  /**
   * Private key in JWK format
   */
  privateKeyJwk: JWK;
  /**
   * Public key in JWK format
   */
  publicKeyJwk: JWK;
};

export type ISIOPSessionPayload = {
  /**
   * Issued at
   */
  iat: number;
  /**
   * Expires at
   */
  exp: number;
  /**
   * Nonce used during the authentication process
   */
  ake1_nonce: string;
  /**
   * Encrypted payload with user's public key
   */
  ake1_enc_payload: string;
  /**
   * API DID
   */
  did: string;
  /**
   * Issuer
   */
  iss: string;
};

export type IRPCResult = {
  /**
   * Must be exactly "2.0"
   */
  jsonrpc: string;
  /**
   * Same identifier established by the client in the call
   */
  id: number;
  /**
   * Result of the call
   */
  result?: string | object;
  /**
   * Error of the call if raised
   */
  error?: string | object;
};

export type IEbsiCreateIdentifierOptions = {
  /**
   * Bearer token needed for authorization
   */
  bearer?: string;
  /**
   * Custom private key to import, must be passed along with subject identifier, of type Secp256k1
   * i.e. 2658053a899091ceb000e0f13d0a47790397e0ebc84e2b6a90489430cb6b9e06
   */
  privateKeyHex?: string;
  /**
   * Imported key type, must be passed along with private key, currently supported only Secp256k1
   */
  keyType?: IEbsiDidSupportedKeyTypes;
  /**
   * Hash type used for generating keys, currently supported only sha256
   */
  hashType?: IEbsiDidSupportedHashTypes;
  /**
   * Custom sequence of 16 bytes used for generating a subject identifier, must be passed along with private key, 32 bytes hex string or uint8array
   * i.e. 27ca548e74bd14275251623cea1ff0c5 or Uint8Array([132, 156, 183, 245, 109, 91, 99, 250, 84, 198, 222, 61, 170, 87, 120, 151])
   */
  id?: Uint8Array | string;
};

export type IEbsiDidSupportedKeyTypes = 'Secp256k1' | 'P-256';
export type IEbsiDidSupportedHashTypes = 'sha256';
export type IEbsiDidSupportedEcdsaAlgo = 'ES256' | 'ES256K';

export type IImportedKey = {
  /**
   * JWK thumbprint
   */
  jwkThumbprint: string;
  /**
   * Passed or generated private key in hex format
   */
  privateKeyHex: string;
  /**
   * Passed or generated private key in JWK format
   */
  privateKeyJwk: JWK;
  /**
   * Passed or generated public key in JWK format
   */
  publicKeyJwk: JWK;
  /**
   * Generated subject identifier
   */
  subjectIdentifier: string;
};

export type IUnsignedTransaction = {
  /**
   * Version of JSON-RPC protocol
   */
  jsonrpc: string;
  /**
   * A number representing the unique ID for this tx
   */
  id: number;
  /**
   * Unsigned transaction
   */
  result: IUnsignedTransactionResult;
};

export type IUnsignedTransactionResult = {
  /**
   * Address of the sender
   */
  from: string;
  /**
   * Address of the receiver
   */
  to: string;
  /**
   * Tx data
   */
  data: string;
  /**
   * Tx nonce
   */
  nonce: string;
  /**
   * ID of the chain
   */
  chainId: string | number;
  /**
   * Max gas limit
   */
  gasLimit: string;
  /**
   * Gas price
   */
  gasPrice: string;
  /**
   * Quantity of Ether to send
   */
  value: string;
};
