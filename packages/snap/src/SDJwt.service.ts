import { SDJwtInstance } from '@sd-jwt/core';
import WalletService from './Wallet.service';
import { digest, generateSalt } from '@sd-jwt/crypto-nodejs';
import { ec as EC } from 'elliptic';
import crypto from 'node:crypto';

type SdJwtPayload = Record<string, unknown>;

class SDJwtService {
  static signer: any;
  static verifier: any;
  static instance: SDJwtInstance<SdJwtPayload>;

  /**
   * Helper function to encode in Base64 URL-safe format.
   */
  private static toBase64Url(buffer: Buffer): string {
    return buffer
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

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

      const ec = new EC('secp256k1');
      const keyPair = ec.keyFromPrivate(privateKeyHex, 'hex');
      const publicKey = keyPair.getPublic();

      if (!keyPair || !publicKey) {
        throw new Error('Keys are missing from WalletService');
      }

      SDJwtService.signer = async (data: string): Promise<string> => {
        const hash = crypto.createHash('sha256').update(data).digest();
        const signature = keyPair.sign(hash);
        return SDJwtService.toBase64Url(
          Buffer.concat([
            Buffer.from(signature.r.toArray('be', 32)),
            Buffer.from(signature.s.toArray('be', 32)),
          ])
        );
      };

      SDJwtService.verifier = async (
        data: string,
        signatureBase64Url: string
      ): Promise<boolean> => {
        const hash = crypto.createHash('sha256').update(data).digest();
        const signatureBuffer = Buffer.from(signatureBase64Url, 'base64url');
        const r = signatureBuffer.subarray(0, 32);
        const s = signatureBuffer.subarray(32);
        return keyPair.verify(hash, { r, s });
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
        signAlg: 'EdDSA',
        hasher: digest,
        hashAlg: 'SHA-256',
        saltGenerator: generateSalt,
      });
    } catch (e) {
      console.error('Failed to initialize SDJwtService', e);
    }
  }

  /**
   * Get the global SDJwtInstance
   * @returns SDJwtInstance
   */
  static getInstance(): SDJwtInstance<any> {
    if (!SDJwtService.instance) {
      throw new Error('---> SDJwtService is not initialized');
    }
    return SDJwtService.instance;
  }
}

export default SDJwtService;
