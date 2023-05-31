import { MULTICODEC_CODE_TO_NAME } from '@blockchain-lab-um/utils';

import {
  DidComponents,
  KeyType,
  MULTICODEC_NAME_TO_KEY_TYPE,
} from './types/keyDidTypes.js';

export const checkDidComponents = (did: string): DidComponents => {
  const components = did.split(':');
  if (components.length === 3) {
    components.splice(2, 0, '1');
  }

  const [scheme, method, version, multibaseValue] = components;

  if (components.length !== 4 && components.length !== 3) {
    throw new Error('invalidDid: invalid number of components');
  }

  if (scheme !== 'did' || method !== 'key') {
    throw new Error('invalidDid: invalid scheme or method');
  }

  const parsedVersion = parseInt(version, 10);
  if (Number.isNaN(parsedVersion) || parsedVersion <= 0) {
    throw new Error('invalidDid: invalid version');
  }

  if (multibaseValue.length === 0 || !multibaseValue.startsWith('z')) {
    throw new Error('invalidDid: invalid multibase value');
  }

  const didComponents: DidComponents = {
    scheme,
    method,
    version,
    multibaseValue,
  };

  return didComponents;
};

export const getKeyType = (code: number): KeyType => {
  const codecName = MULTICODEC_CODE_TO_NAME[`0x${code.toString(16)}`];

  if (!codecName) {
    throw new Error('invalidDid: invalid key type');
  }

  const keyType = MULTICODEC_NAME_TO_KEY_TYPE[codecName];

  if (!keyType) {
    throw new Error('invalidDid: invalid key type');
  }

  return keyType;
};

export const getContext = (keyType: KeyType): string[] => {
  switch (keyType) {
    case 'Ed25519': {
      return [
        'https://w3id.org/security/suites/ed25519-2020/v1',
        'https://w3id.org/security/suites/x25519-2020/v1',
      ];
    }
    case 'Secp256k1': {
      return [
        'https://w3id.org/security#EcdsaSecp256k1VerificationKey2019',
        'https://w3id.org/security#publicKeyJwk',
      ];
    }
    default: {
      throw new Error('invalidDid: invalid key type');
    }
  }
};
