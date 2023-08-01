import crypto from 'crypto';
import type {
  AvailableVCStores,
  MascaState,
} from '@blockchain-lab-um/masca-types';
import { hexToUint8Array, uint8ArrayToHex } from '@blockchain-lab-um/utils';
import type { Component } from '@metamask/snaps-ui';

/**
 * Function that returns whether the user has confirmed the snap dialog.
 * @param content - content to display in the snap dialog.
 * @returns boolean - whether the user has confirmed the snap dialog.
 */
export async function snapConfirm(content: Component): Promise<boolean> {
  const res = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content,
    },
  });
  return res as boolean;
}

/**
 * Checks if the passed VC store is enabled for the passed account.
 * @param account - account to check.
 * @param state - masca state object.
 * @param store - vc store to check.
 * @returns boolean - whether the vc store is enabled.
 */
export function isEnabledVCStore(
  account: string,
  state: MascaState,
  store: AvailableVCStores
): boolean {
  return state.accountState[account].accountConfig.ssi.vcStore[store];
}

/**
 * Function that encrypts the passed data using the entropy provided by the snap.
 * The returned string is in the format: cipherText:iv.
 * The algorithm used is AES-GCM.
 * The key is derived from the entropy using the WebCrypto API.
 */
export async function encryptData(data: string): Promise<string> {
  const entropy = await snap.request({
    method: 'snap_getEntropy',
    params: {
      version: 1,
    },
  });
  const rawKey = Buffer.from(entropy.slice(2), 'hex');
  const key = await crypto.subtle.importKey('raw', rawKey, 'AES-GCM', true, [
    'encrypt',
    'decrypt',
  ]);
  // 96 bits IV as recommended
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipherText = await crypto.subtle.encrypt(
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
 * The passed string must be in the format: cipherText:iv.
 * The algorithm used is AES-GCM.
 */
export async function decryptData(data: string): Promise<string> {
  const entropy = await snap.request({
    method: 'snap_getEntropy',
    params: {
      version: 1,
    },
  });
  const rawKey = Buffer.from(entropy.slice(2), 'hex');
  const key = await crypto.subtle.importKey('raw', rawKey, 'AES-GCM', true, [
    'encrypt',
    'decrypt',
  ]);
  const [cipherText, iv] = data.split(':');
  const decryptedData = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: hexToUint8Array(iv),
    },
    key,
    hexToUint8Array(cipherText)
  );

  return new TextDecoder().decode(decryptedData);
}
