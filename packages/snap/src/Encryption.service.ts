import { hexToUint8Array, uint8ArrayToHex } from '@blockchain-lab-um/utils';

class EncryptionService {
  /**
   * Function that encrypts the passed data using the entropy provided by the snap.
   * The algorithm used is AES-GCM.
   * The key is derived from the entropy using the WebCrypto API.
   *
   * @param data - Data to encrypt
   * @returns string - Encrypted data in the format: `cipherText:salt:iv`
   */
  static async encrypt(data: string): Promise<string> {
    const entropy = await snap.request({
      method: 'snap_getEntropy',
      params: {
        version: 1,
      },
    });

    const entropyBuffer = Buffer.from(entropy.slice(2), 'hex');

    const importedKey = await window.crypto.subtle.importKey(
      'raw',
      entropyBuffer,
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    entropyBuffer.fill(0);

    // 256 bit salt
    const salt = window.crypto.getRandomValues(new Uint8Array(32));

    const derivedKey = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 600000,
        hash: 'SHA-256',
      },
      importedKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    // 96 bits IV as recommended
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const cipherText = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      derivedKey,
      new TextEncoder().encode(data)
    );

    return `${Buffer.from(cipherText).toString('hex')}:${uint8ArrayToHex(
      salt
    )}:${uint8ArrayToHex(iv)}`;
  }

  /**
   * Function that decrypts the passed data using the entropy provided by the snap.
   * The algorithm used is AES-GCM.
   *
   * @param data - Data to decrypt in the format: `cipherText:salt:iv`
   * @returns string - Decrypted data
   */
  static async decrypt(data: string): Promise<string> {
    const entropy = await snap.request({
      method: 'snap_getEntropy',
      params: {
        version: 1,
      },
    });

    const entropyBuffer = Buffer.from(entropy.slice(2), 'hex');

    const [cipherText, salt, iv] = data.split(':');

    const importedKey = await window.crypto.subtle.importKey(
      'raw',
      entropyBuffer,
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    entropyBuffer.fill(0);

    const derivedKey = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: hexToUint8Array(salt),
        iterations: 600000,
        hash: 'SHA-256',
      },
      importedKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: hexToUint8Array(iv),
      },
      derivedKey,
      hexToUint8Array(cipherText)
    );

    return new TextDecoder().decode(decryptedData);
  }
}

export default EncryptionService;
