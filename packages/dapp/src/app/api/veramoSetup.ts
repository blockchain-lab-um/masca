import { getDidKeyResolver as didKeyResolver } from '@blockchain-lab-um/did-provider-key';
import { JsonRpcProvider } from '@ethersproject/providers';
import {
  createAgent,
  type ICredentialVerifier,
  type IDIDManager,
  type IKeyManager,
  type IResolver,
  type TAgent,
} from '@veramo/core';
import { CredentialIssuerEIP712 } from '@veramo/credential-eip712';
import {
  CredentialPlugin,
  type ICredentialIssuer,
} from '@veramo/credential-w3c';
import { getDidPkhResolver as didPkhResolver } from '@veramo/did-provider-pkh';
import { DIDResolverPlugin } from '@veramo/did-resolver';
import { Resolver } from 'did-resolver';
import { getResolver as didEthrResolver } from 'ethr-did-resolver';

export type Agent = TAgent<
  IDIDManager & IKeyManager & IResolver & ICredentialVerifier
>;

const networks = [
  {
    name: 'mainnet',
    provider: new JsonRpcProvider(
      process.env.NEXT_PUBLIC_MAINNET_RPC_URL || 'https://mainnet.infura.io/v3/'
    ),
  },
  {
    name: 'sepolia',
    provider: new JsonRpcProvider(
      process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/'
    ),
    chainId: '0xaa36a7',
  },
];

export const getAgent = async (): Promise<Agent> => {
  const agent = createAgent<
    IDIDManager &
      IKeyManager &
      IResolver &
      ICredentialIssuer &
      ICredentialVerifier
  >({
    plugins: [
      new CredentialPlugin(),
      new CredentialIssuerEIP712(),

      new DIDResolverPlugin({
        resolver: new Resolver({
          ...didEthrResolver({ networks }),
          ...didPkhResolver(),
          ...didKeyResolver(),
        }),
      }),
    ],
  });

  return agent;
};
