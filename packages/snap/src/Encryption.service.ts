import { hexToUint8Array, uint8ArrayToHex } from '@blockchain-lab-um/utils';

class EncryptionService {
  /**
   * Function that encrypts the passed data using the entropy provided by the snap.
   * The algorithm used is AES-GCM.
   * The key is derived from the entropy using the WebCrypto API.
   *
   * @param data - Data to encrypt
   * @returns string - Encrypted data in the format: `cipherText:iv`
   */
  static async encrypt(data: string): Promise<string> {
    const entropy = await snap.request({
      method: 'snap_getEntropy',
      params: {
        version: 1,
      },
    });
    const rawKey = Buffer.from(entropy.slice(2), 'hex');
    const key = await window.crypto.subtle.importKey(
      'raw',
      rawKey,
      'AES-GCM',
      true,
      ['encrypt', 'decrypt']
    );

    // 96 bits IV as recommended
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const cipherText = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      new TextEncoder().encode(data)
    );

    return `${Buffer.from(cipherText).toString('hex')}:${uint8ArrayToHex(iv)}`;
  }

  /**
   * Function that decrypts the passed data using the entropy provided by the snap.
   * The algorithm used is AES-GCM.
   *
   * @param data - Data to decrypt in the format: `cipherText:iv`
   * @returns string - Decrypted data
   */
  static async decrypt(data: string): Promise<string> {
    const entropy = await snap.request({
      method: 'snap_getEntropy',
      params: {
        version: 1,
      },
    });

    const rawKey = Buffer.from(entropy.slice(2), 'hex');
    const key = await window.crypto.subtle.importKey(
      'raw',
      rawKey,
      'AES-GCM',
      true,
      ['encrypt', 'decrypt']
    );

    const [cipherText, iv] = data.split(':');
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: hexToUint8Array(iv),
      },
      key,
      hexToUint8Array(cipherText)
    );

    return new TextDecoder().decode(decryptedData);
  }
}

export default EncryptionService;
