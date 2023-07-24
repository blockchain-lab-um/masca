import {
  AuthHandler,
  BjjProvider,
  byteEncoder,
  CircuitData,
  CircuitId,
  CredentialStatusResolverRegistry,
  CredentialStatusType,
  CredentialStorage,
  CredentialWallet,
  DataPrepareHandlerFunc,
  EthStateStorage,
  FetchHandler,
  hexToBytes,
  IdentityStorage,
  IdentityWallet,
  InMemoryPrivateKeyStore,
  IssuerResolver,
  JWSPacker,
  KMS,
  KmsKeyType,
  OnChainResolver,
  PackageManager,
  PlainPacker,
  ProofService,
  PROTOCOL_CONSTANTS,
  RHSResolver,
  VerificationHandlerFunc,
  W3CCredential,
  ZKPPacker,
} from '@0xpolygonid/js-sdk';
import {
  HandleAuthorizationRequestParams,
  HandleCredentialOfferRequestParams,
} from '@blockchain-lab-um/masca-types';
import { Blockchain, DID, DidMethod, NetworkId } from '@iden3/js-iden3-core';
import { proving } from '@iden3/js-jwz';

import { DIDResolutionOptions, DIDResolutionResult } from 'did-resolver';
import EthereumService from '../Ethereum.service';
import StorageService from '../storage/Storage.service';
import CircuitStorageService from './CircuitStorage.service';
import {
  BLOCKCHAINS,
  CHAIN_ID_TO_BLOCKCHAIN_AND_NETWORK_ID,
  getDefaultEthConnectionConfig,
  METHODS,
  NETWORKS,
  RHS_URL,
} from './constants';
import { SnapDataSource, SnapMerkleTreeStorage } from './storage';

type PolygonServicBaseInstance = {
  packageMgr: PackageManager;
  proofService: ProofService;
  credWallet: CredentialWallet;
  wallet: IdentityWallet;
  kms: KMS;
  dataStorage: {
    credential: CredentialStorage;
    identity: IdentityStorage;
    mt: SnapMerkleTreeStorage;
    states: EthStateStorage;
  };
  authHandler: AuthHandler;
};

class PolygonService {
  static metadata: {
    method: (typeof METHODS)[number];
    blockchain: (typeof BLOCKCHAINS)[number];
    networkId: (typeof NETWORKS)[number];
  };

  static instance: Record<
    DidMethod.Iden3 | DidMethod.PolygonId,
    Record<
      Blockchain.Ethereum | Blockchain.Polygon,
      Record<
        NetworkId.Main | NetworkId.Goerli | NetworkId.Mumbai,
        PolygonServicBaseInstance
      >
    >
  > = {
    polygonid: {
      eth: {
        main: {} as PolygonServicBaseInstance,
        goerli: {} as PolygonServicBaseInstance,
        mumbai: {} as PolygonServicBaseInstance,
      },
      polygon: {
        main: {} as PolygonServicBaseInstance,
        goerli: {} as PolygonServicBaseInstance,
        mumbai: {} as PolygonServicBaseInstance,
      },
    },
    iden3: {
      eth: {
        main: {} as PolygonServicBaseInstance,
        goerli: {} as PolygonServicBaseInstance,
        mumbai: {} as PolygonServicBaseInstance,
      },
      polygon: {
        main: {} as PolygonServicBaseInstance,
        goerli: {} as PolygonServicBaseInstance,
        mumbai: {} as PolygonServicBaseInstance,
      },
    },
  };

  static async init() {
    // Load Circuits to memory
    await CircuitStorageService.init();

    const authV2CircuitData = await CircuitStorageService.get().loadCircuitData(
      CircuitId.AuthV2
    );

    // Create instances for each valid method, blockchain and network combination
    for (const method of METHODS) {
      for (const blockchain of BLOCKCHAINS) {
        for (const networkId of NETWORKS) {
          if (
            !(
              blockchain === Blockchain.Ethereum &&
              networkId === NetworkId.Mumbai
            ) &&
            !(
              blockchain === Blockchain.Polygon &&
              networkId === NetworkId.Goerli
            )
          ) {
            this.instance[method][blockchain][networkId] =
              await this.createBaseInstance({
                method,
                blockchain,
                networkId,
                circuitData: authV2CircuitData,
              });
          }
        }
      }
    }
  }

  static async createOrImportIdentity() {
    const state = StorageService.get();
    const { didMethod } =
      state.accountState[state.currentAccount].accountConfig.ssi;

    if (didMethod !== 'did:iden3' && didMethod !== 'did:polygonid') {
      throw new Error('Unsupported did method');
    }

    const method =
      didMethod === 'did:iden3' ? DidMethod.Iden3 : DidMethod.PolygonId;
    const network = await EthereumService.getNetwork();
    const mapping = CHAIN_ID_TO_BLOCKCHAIN_AND_NETWORK_ID[network];

    if (!mapping) {
      throw new Error('Unsupported network');
    }

    const { blockchain, networkId } = mapping;

    // Set metadata so we can reuse it later
    this.metadata = {
      method,
      blockchain,
      networkId,
    };

    const { dataStorage, wallet, kms } =
      this.instance[method][blockchain][networkId];

    const identity = (await dataStorage.identity.getAllIdentities())[0];

    const entropy = await snap.request({
      method: 'snap_getEntropy',
      params: { version: 1, salt: state.currentAccount },
    });

    // If identity exists, import keys
    if (identity) {
      await kms.createKeyFromSeed(KmsKeyType.BabyJubJub, hexToBytes(entropy));
      return;
    }

    // If identity does not exist, create it
    await wallet.createIdentity({
      method,
      blockchain,
      networkId,
      seed: hexToBytes(entropy),
      revocationOpts: {
        id: RHS_URL,
        type: CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
      },
    });
  }

  static async createBaseInstance(args: {
    method: DidMethod.Iden3 | DidMethod.PolygonId;
    blockchain: Blockchain.Ethereum | Blockchain.Polygon;
    networkId: NetworkId.Main | NetworkId.Goerli | NetworkId.Mumbai;
    circuitData: CircuitData;
  }) {
    const { method, blockchain, networkId, circuitData } = args;

    const circuitStorage = CircuitStorageService.get();

    const accountInfo = await PolygonService.createWallet({
      method,
      blockchain,
      networkId,
    });

    const { wallet, credWallet, dataStorage, kms } = accountInfo;

    const proofService = new ProofService(
      wallet,
      credWallet,
      circuitStorage,
      new EthStateStorage(getDefaultEthConnectionConfig(blockchain, networkId)),
      { ipfsGatewayURL: 'https://ipfs.io' }
    );

    const packageMgr = await this.getPackageMgr({
      circuitData,
      proofService,
      kms,
    });

    const authHandler = new AuthHandler(packageMgr, proofService);

    return {
      packageMgr,
      proofService,
      credWallet,
      wallet,
      kms,
      dataStorage,
      authHandler,
    };
  }

  static async saveCredential(credential: W3CCredential) {
    const { method, blockchain, networkId } = this.metadata;
    const { credWallet } = this.instance[method][blockchain][networkId];

    // Check if credential subject is correct
    const { id } = credential.credentialSubject;

    const identifier = await this.getIdentifier();

    if (id !== identifier) {
      throw new Error('The credential does not belong to the current identity');
    }

    await credWallet.save(credential);
  }

  static async queryCredentials(): Promise<W3CCredential[]> {
    const credentials = [];

    // FIXME: Can we do this in parallel? Does it make sense?
    // We query for all instances
    for (const method of METHODS) {
      for (const blockchain of BLOCKCHAINS) {
        for (const networkId of NETWORKS) {
          if (
            !(
              blockchain === Blockchain.Ethereum &&
              networkId === NetworkId.Mumbai
            ) &&
            !(
              blockchain === Blockchain.Polygon &&
              networkId === NetworkId.Goerli
            )
          ) {
            const { credWallet } = this.instance[method][blockchain][networkId];
            credentials.push(...(await credWallet.list()));
          }
        }
      }
    }

    return credentials;
  }

  static async deleteCredential(id: string) {
    // FIXME: Can we do this in parallel? Does it make sense?
    // FIXME: Should we pass in credential so we know from which method, blockchain and network to delete?
    for (const method of METHODS) {
      for (const blockchain of BLOCKCHAINS) {
        for (const networkId of NETWORKS) {
          if (
            !(
              blockchain === Blockchain.Ethereum &&
              networkId === NetworkId.Mumbai
            ) &&
            !(
              blockchain === Blockchain.Polygon &&
              networkId === NetworkId.Goerli
            )
          ) {
            const { credWallet } = this.instance[method][blockchain][networkId];
            await credWallet.remove(id);
          }
        }
      }
    }
  }

  static async getIdentifier(): Promise<string> {
    const { method, blockchain, networkId } = this.metadata;
    const identity = (
      await this.instance[method][blockchain][
        networkId
      ].dataStorage.identity.getAllIdentities()
    )[0];

    if (!identity) {
      throw new Error('Missing identity');
    }

    return identity.did;
  }

  static async handleCredentialOffer(
    args: HandleCredentialOfferRequestParams
  ): Promise<W3CCredential[]> {
    const { credentialOffer } = args;
    const { method, blockchain, networkId } = this.metadata;

    const { packageMgr } = this.instance[method][blockchain][networkId];

    const fetchHandler = new FetchHandler(packageMgr);
    const messageBytes = byteEncoder.encode(credentialOffer);

    try {
      const credentials = await fetchHandler.handleCredentialOffer(
        messageBytes,
        {
          mediaType: PROTOCOL_CONSTANTS.MediaType.ZKPMessage,
        }
      );

      return credentials;
    } catch (e) {
      console.log('error', e);
      throw new Error('Error handling credential offer');
    }
  }

  static async handleAuthorizationRequest(
    args: HandleAuthorizationRequestParams
  ): Promise<void> {
    const { authorizationRequest } = args;
    const { method, blockchain, networkId } = this.metadata;

    const { authHandler } = this.instance[method][blockchain][networkId];

    const messageBytes = byteEncoder.encode(authorizationRequest);

    try {
      const did = DID.parse(await this.getIdentifier());

      const { token, authRequest } =
        await authHandler.handleAuthorizationRequest(
          did,
          messageBytes,
          {
            mediaType: PROTOCOL_CONSTANTS.MediaType.ZKPMessage,
          },
        );

      if (!authRequest.body?.callbackUrl) {
        throw new Error('Callback url missing in authorization request');
      }

      await fetch(`${authRequest.body.callbackUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: token,
      });
    } catch (e) {
      console.log(e);
      throw new Error('Error sending authorization response');
    }
  }

  static async createWallet(args: {
    method: DidMethod.Iden3 | DidMethod.PolygonId;
    blockchain: Blockchain.Ethereum | Blockchain.Polygon;
    networkId: NetworkId.Main | NetworkId.Goerli | NetworkId.Mumbai;
  }) {
    const { method, blockchain, networkId } = args;
    const state = StorageService.get();
    const account = state.currentAccount;
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
      states: new EthStateStorage(
        getDefaultEthConnectionConfig(blockchain, networkId)
      ),
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
      new OnChainResolver([
        getDefaultEthConnectionConfig(blockchain, networkId),
      ])
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

  private static async getPackageMgr(args: {
    circuitData: CircuitData;
    proofService: ProofService;
    kms: KMS;
  }) {
    const { circuitData, proofService, kms } = args;
    const authInputsHandler = new DataPrepareHandlerFunc(
      (
        hash: Uint8Array,
        did: DID,
        circuitId: CircuitId
      ) => proofService.generateAuthV2Inputs(hash, did, circuitId)
    );
    const verificationFn = new VerificationHandlerFunc(
      (id: string, pubSignals: Array<string>) =>
        proofService.verifyState(id, pubSignals)
    );
    const mapKey =
      proving.provingMethodGroth16AuthV2Instance.methodAlg.toString();
    const verificationParamMap = new Map([
      [
        mapKey,
        {
          key: circuitData.verificationKey,
          verificationFn,
        },
      ],
    ]);

    const provingParamMap = new Map();
    provingParamMap.set(mapKey, {
      dataPreparer: authInputsHandler,
      provingKey: circuitData.provingKey,
      wasm: circuitData.wasm,
    });

    const mgr = new PackageManager();
    const packer = new ZKPPacker(provingParamMap, verificationParamMap);
    const plainPacker = new PlainPacker();


    const resolveDIDDocument = async (
      did: string,
      _?: DIDResolutionOptions,
    ): Promise<DIDResolutionResult> => {
      try {
        const response = await fetch(
          `https://dev.uniresolver.io/1.0/identifiers/${did}`,
        );
        const data = await response.json();
        return data as DIDResolutionResult;
      } catch (error: unknown) {
        throw new Error(
          `Can't resolve did document: ${(error as Error).message}`,
        );
      }
    };

    const jwsPacker = new JWSPacker(kms, { resolve: resolveDIDDocument });

    mgr.registerPackers([packer, plainPacker, jwsPacker]);

    return mgr;
  }
}

export default PolygonService;
