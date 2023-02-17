import { ec as EC } from 'elliptic';
import { Result } from './result';

// TODO: Add keyType as an argument
// TODO: Add checks for supported key types and did methods
export type PrivateKeyToDidArgs = {
  privateKey: string;
  didMethod: string;
};

export type PrivateKeyToDidResponse = {
  did: string;
};

export const privateKeyToDid = async (
  args: PrivateKeyToDidArgs
): Promise<Result<PrivateKeyToDidResponse>> => {
  const { privateKey, didMethod } = args;
  const ctx = new EC('secp256k1');
  const ecPrivateKey = ctx.keyFromPrivate(privateKey);
  const compactPublicKey = `0x${ecPrivateKey.getPublic(true, 'hex')}`;
  const did = `${didMethod}:${compactPublicKey}`;

  return {
    success: true,
    data: {
      did,
    },
  };
};
