import {
  BjjProvider,
  CredentialStatusResolverRegistry,
  CredentialStatusType,
  CredentialStorage,
  CredentialWallet,
  EthStateStorage,
  IdentityStorage,
  IdentityWallet,
  InMemoryPrivateKeyStore,
  IssuerResolver,
  KMS,
  KmsKeyType,
  OnChainResolver,
  RHSResolver,
} from '@0xpolygonid/js-sdk';
import { Blockchain, DidMethod, NetworkId } from '@iden3/js-iden3-core';

import { defaultEthConnectionConfig } from './constants';
import { SnapDataSource, SnapMerkleTreeStorage } from './storage';

export class WalletService {
  static async createWallet(
    account: string,
    method: DidMethod.Iden3 | DidMethod.PolygonId,
    blockchain: Blockchain.Ethereum | Blockchain.Polygon,
    networkId: NetworkId.Main | NetworkId.Goerli | NetworkId.Mumbai
  ) {
    const memoryKeyStore = new InMemoryPrivateKeyStore();
    const bjjProvider = new BjjProvider(KmsKeyType.BabyJubJub, memoryKeyStore);
    const kms = new KMS();
    kms.registerKeyProvider(KmsKeyType.BabyJubJub, bjjProvider);

    const dataStorage = {
      credential: new CredentialStorage(
        new SnapDataSource(
          account,
          method,
          blockchain,
          networkId,
          CredentialStorage.storageKey
        )
      ),
      identity: new IdentityStorage(
        new SnapDataSource(
          account,
          method,
          blockchain,
          networkId,
          IdentityStorage.identitiesStorageKey
        ),
        new SnapDataSource(
          account,
          method,
          blockchain,
          networkId,
          IdentityStorage.profilesStorageKey
        )
      ),
      mt: new SnapMerkleTreeStorage(account, method, blockchain, networkId, 40),
      states: new EthStateStorage(defaultEthConnectionConfig),
    };

    const resolvers = new CredentialStatusResolverRegistry();
    resolvers.register(
      CredentialStatusType.SparseMerkleTreeProof,
      new IssuerResolver()
    );

    resolvers.register(
      CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
      new RHSResolver(dataStorage.states)
    );

    resolvers.register(
      CredentialStatusType.Iden3OnchainSparseMerkleTreeProof2023,
      new OnChainResolver([defaultEthConnectionConfig])
    );

    const credWallet = new CredentialWallet(dataStorage, resolvers);
    const wallet = new IdentityWallet(kms, dataStorage, credWallet);

    return {
      wallet,
      credWallet,
      kms,
      dataStorage,
    };
  }
}
