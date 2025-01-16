import { getDidKeyResolver as keyDidResolver } from '@blockchain-lab-um/did-provider-key';
import { UniversalResolverService } from '@blockchain-lab-um/utils';
import {
  type ICredentialVerifier,
  type IResolver,
  type TAgent,
  createAgent,
} from '@veramo/core';
import { CredentialIssuerEIP712 } from '@veramo/credential-eip712';
import { CredentialPlugin } from '@veramo/credential-w3c';
import { getDidJwkResolver as jwkDidResolver } from '@veramo/did-provider-jwk';
import { getDidPkhResolver as pkhDidResolver } from '@veramo/did-provider-pkh';
import { DIDResolverPlugin } from '@veramo/did-resolver';
import { Resolver } from 'did-resolver';
import { getResolver as ensDidResolver } from 'ens-did-resolver';
import { JsonRpcProvider, type Provider } from 'ethers';
import { getResolver as ethrDidResolver } from 'ethr-did-resolver';

export interface CreateVeramoAgentProps {
  providers?: Record<string, Provider>;
}

export const createVeramoAgent: (
  props?: CreateVeramoAgentProps
) => Promise<TAgent<IResolver & ICredentialVerifier>> = async (
  props?: CreateVeramoAgentProps
) => {
  const { providers } = props ?? {};
  // This any is here, because Veramo does't export the `ProviderConfiguration` type
  // from `ethr-did-resolver` and `ens-did-resolver` package uses Ethers v5 still with a
  // different `Provider` type
  const networks: any = [
    {
      name: '',
      provider:
        providers?.mainnet ?? new JsonRpcProvider('https://eth.llamarpc.com'),
    },
    {
      name: 'mainnet',
      provider:
        providers?.mainnet ?? new JsonRpcProvider('https://eth.llamarpc.com'),
    },
    {
      name: 'sepolia',
      provider:
        providers?.sepolia ??
        new JsonRpcProvider('https://sepolia.gateway.tenderly.co'),
      registry: '0x03d5003bf0e79c5f5223588f347eba39afbc3818',
    },
  ];

  UniversalResolverService.init();

  return createAgent<IResolver & ICredentialVerifier>({
    plugins: [
      new CredentialPlugin(),
      new CredentialIssuerEIP712(),
      new DIDResolverPlugin({
        resolver: new Resolver({
          ...ethrDidResolver({ networks }),
          ...keyDidResolver(),
          ...pkhDidResolver(),
          ...jwkDidResolver(),
          ...ensDidResolver({
            networks,
          }),
          ...UniversalResolverService.getResolver(),
        }),
      }),
    ],
  });
};

export type Agent = TAgent<IResolver & ICredentialVerifier>;
