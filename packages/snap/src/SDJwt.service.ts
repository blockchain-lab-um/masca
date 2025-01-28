import { SDJwtInstance } from '@sd-jwt/core';
import WalletService from './Wallet.service';
import { digest, generateSalt } from '@sd-jwt/crypto-nodejs';
import { ec as EC } from 'elliptic';
import { bytesToBase64url, decodeBase64url } from '@veramo/utils';

type SdJwtPayload = Record<string, unknown>;

class SDJwtService {
  static signer: (data: string) => Promise<string>;
  static verifier: (
    data: string,
    signatureBase64Url: string
  ) => Promise<boolean>;
  static instance: SDJwtInstance<SdJwtPayload>;

  /**
   * Initializes the SDJwtService.
   *
   * This method sets up the SDJwtService by retrieving the wallet from the WalletService,
   * extracting the private key, and creating the key pair. It also sets up the signer and
   * verifier functions for the SDJwtService instance.
   *
   * @throws {Error} If the wallet cannot be retrieved or keys are missing.
   *
   * @returns {Promise<void>} A promise that resolves when the initialization is complete.
   */
  static async init(): Promise<void> {
    try {
      const wallet = WalletService.get();

      if (!wallet) {
        throw new Error('Failed to retrieve keys');
      }

      const privateKeyHex = wallet.privateKey.slice(2); // Remove '0x' prefix

      const ec = new EC('p256');
      const keyPair = ec.keyFromPrivate(privateKeyHex, 'hex');
      const publicKey = keyPair.getPublic();

      if (!keyPair || !publicKey) {
        throw new Error('Keys are missing from WalletService');
      }

      SDJwtService.signer = async (data: string): Promise<string> => {
        const signature = keyPair.sign(Buffer.from(data));

        return bytesToBase64url(
          Buffer.concat([
            signature.r.toArrayLike(Buffer, 'be', 32),
            signature.s.toArrayLike(Buffer, 'be', 32),
          ])
        );
      };

      SDJwtService.verifier = async (
        data: string,
        signatureBase64Url: string
      ): Promise<boolean> => {
        const signatureBuffer = decodeBase64url(signatureBase64Url);

        const r = signatureBuffer.substring(0, 32);
        const s = signatureBuffer.substring(32);

        return keyPair.verify(Buffer.from(data), { r, s });
      };

      SDJwtService.instance = new SDJwtInstance({
        signer: SDJwtService.signer
          ? SDJwtService.signer
          : async () => {
              throw new Error('Signer not initialized');
            },
        verifier: SDJwtService.verifier
          ? SDJwtService.verifier
          : async () => {
              throw new Error('Verifier not initialized');
            },
        signAlg: 'ES256',
        hasher: digest,
        hashAlg: 'sha-256',
        saltGenerator: generateSalt,
        kbSigner: SDJwtService.signer,
        kbVerifier: SDJwtService.verifier,
        kbSignAlg: 'ES256',
      });
    } catch (e) {
      console.error('Failed to initialize SDJwtService', e);
    }
  }

  /**
   * Get the global SDJwtInstance
   * @returns SDJwtInstance
   */
  static get(): SDJwtInstance<any> {
    if (!SDJwtService.instance) {
      throw new Error('---> SDJwtService is not initialized');
    }
    return SDJwtService.instance;
  }
}

export default SDJwtService;
