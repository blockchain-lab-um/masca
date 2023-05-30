import { CodecName, MULTICODECSCODES } from '@blockchain-lab-um/utils';

import { KeyOptions, type DidComponents } from './types/keyDidTypes.js';

export function checkDidComponents(did: string): DidComponents {
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
}

export function getKeyType(code: number): keyof typeof KeyOptions {
  const codecName = Object.keys(MULTICODECSCODES).find((key) => {
    return MULTICODECSCODES[key as CodecName] === `0x${code.toString(16)}`;
  });
  if (!codecName) {
    throw new Error('invalidDid: invalid key type');
  }
  const indexOfS = Object.values(KeyOptions).indexOf(
    codecName as unknown as KeyOptions
  );
  const keyType = Object.keys(KeyOptions)[indexOfS] as keyof typeof KeyOptions;
  return keyType;
}

export function getContext(keyType: keyof typeof KeyOptions) {
  switch (keyType) {
    case 'Ed25519':
      return [
        'https://w3id.org/security/suites/ed25519-2020/v1',
        'https://w3id.org/security/suites/x25519-2020/v1',
      ];
    case 'Secp256k1':
      return [
        'https://w3id.org/security#EcdsaSecp256k1VerificationKey2019',
        'https://w3id.org/security#publicKeyJwk',
      ];
    default:
      throw new Error('invalidDid: invalid key type');
  }
}
