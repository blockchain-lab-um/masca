import { W3CVerifiableCredential } from '@veramo/core';

export function normalizeCredential(obj: W3CVerifiableCredential): any {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(normalizeCredential) as any;
  }

  const sortedKeys = Object.keys(obj).sort();

  return sortedKeys.reduce((result, key) => {
    result[key] = normalizeCredential(obj[key]);
    return result as W3CVerifiableCredential;
  }, {} as any);
}
