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

import { defaultEthConnectionConfig } from './constants';
import { SnapDataSource, SnapMerkleTreeStorage } from './storage';

export class WalletService {
  static async createWallet(account: string) {
    const memoryKeyStore = new InMemoryPrivateKeyStore();
    // const snapKeyStore = new SnapStoragePrivateKeyStore(account);
    const bjjProvider = new BjjProvider(KmsKeyType.BabyJubJub, memoryKeyStore);
    const kms = new KMS();
    kms.registerKeyProvider(KmsKeyType.BabyJubJub, bjjProvider);

    const dataStorage = {
      credential: new CredentialStorage(
        new SnapDataSource(account, CredentialStorage.storageKey)
      ),
      identity: new IdentityStorage(
        new SnapDataSource(account, IdentityStorage.identitiesStorageKey),
        new SnapDataSource(account, IdentityStorage.profilesStorageKey)
      ),
      mt: new SnapMerkleTreeStorage(account, 40),
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
