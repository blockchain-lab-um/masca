import {
  AuthHandler,
  BjjProvider,
  CircuitData,
  CircuitId,
  CredentialStatusResolverRegistry,
  CredentialStatusType,
  CredentialStorage,
  CredentialWallet,
  DataPrepareHandlerFunc,
  EthStateStorage,
  FetchHandler,
  IdentityStorage,
  IdentityWallet,
  InMemoryPrivateKeyStore,
  IssuerResolver,
  JWSPacker,
  KMS,
  KmsKeyType,
  OnChainResolver,
  PROTOCOL_CONSTANTS,
  PackageManager,
  PlainPacker,
  ProofService,
  RHSResolver,
  VerifiableConstants,
  VerificationHandlerFunc,
  W3CCredential,
  ZKPPacker,
  byteEncoder,
  hexToBytes,
} from '@0xpolygonid/js-sdk';
import {
  CURRENT_STATE_VERSION,
  HandleAuthorizationRequestParams,
  HandleCredentialOfferRequestParams,
} from '@blockchain-lab-um/masca-types';
import { Blockchain, DID, DidMethod, NetworkId } from '@iden3/js-iden3-core';
import { proving } from '@iden3/js-jwz';
import { DIDResolutionOptions, DIDResolutionResult } from 'did-resolver';

import EthereumService from '../Ethereum.service';
import StorageService from '../storage/Storage.service';
import { UNIRESOLVER_PROXY_URL } from '../utils/config';
import CircuitStorageService from './CircuitStorage.service';
import {
  BLOCKCHAINS,
  CHAIN_ID_TO_BLOCKCHAIN_AND_NETWORK_ID,
  METHODS,
  NETWORKS,
  RHS_URL,
  getDefaultEthConnectionConfig,
} from './constants';
import { SnapDataSource, SnapMerkleTreeStorage } from './storage';

interface PolygonServicBaseInstance {
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
}

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
      Record<NetworkId.Main | NetworkId.Mumbai, PolygonServicBaseInstance>
    >
  > = {
    polygonid: {
      eth: {
        main: {} as PolygonServicBaseInstance,
        mumbai: {} as PolygonServicBaseInstance,
      },
      polygon: {
        main: {} as PolygonServicBaseInstance,
        mumbai: {} as PolygonServicBaseInstance,
      },
    },
    iden3: {
      eth: {
        main: {} as PolygonServicBaseInstance,
        mumbai: {} as PolygonServicBaseInstance,
      },
      polygon: {
        main: {} as PolygonServicBaseInstance,
        mumbai: {} as PolygonServicBaseInstance,
      },
    },
  };

  static get() {
    const { method, blockchain, networkId } = PolygonService.metadata;
    return PolygonService.instance[method][blockchain][networkId];
  }

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
            )
          ) {
            PolygonService.instance[method][blockchain][networkId] =
              await PolygonService.createBaseInstance({
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
    const { selectedMethod } =
      state[CURRENT_STATE_VERSION].accountState[
        state[CURRENT_STATE_VERSION].currentAccount
      ].general.account.ssi;

    if (selectedMethod !== 'did:iden3' && selectedMethod !== 'did:polygonid') {
      throw new Error('Unsupported did method');
    }

    const method =
      selectedMethod === 'did:iden3' ? DidMethod.Iden3 : DidMethod.PolygonId;
    const network = await EthereumService.getNetwork();
    const mapping = CHAIN_ID_TO_BLOCKCHAIN_AND_NETWORK_ID[network];

    if (!mapping) {
      throw new Error('Unsupported network');
    }

    const { blockchain, networkId } = mapping;

    // Set metadata so we can reuse it later
    PolygonService.metadata = {
      method,
      blockchain,
      networkId,
    };

    const { dataStorage, wallet, kms } =
      PolygonService.instance[method][blockchain][networkId];

    const identity = (await dataStorage.identity.getAllIdentities())[0];
    const entropy = await snap.request({
      method: 'snap_getEntropy',
      params: { version: 1, salt: state[CURRENT_STATE_VERSION].currentAccount },
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

  static async createBaseInstance(params: {
    method: DidMethod.Iden3 | DidMethod.PolygonId;
    blockchain: Blockchain.Ethereum | Blockchain.Polygon;
    networkId: NetworkId.Main | NetworkId.Mumbai;
    circuitData: CircuitData;
  }) {
    const { method, blockchain, networkId, circuitData } = params;

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

    const packageMgr = await PolygonService.getPackageMgr({
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
    const { method, blockchain, networkId } = PolygonService.metadata;
    const { credWallet } =
      PolygonService.instance[method][blockchain][networkId];

    // Check if credential subject is correct
    const { id } = credential.credentialSubject;

    const identifier = await PolygonService.getIdentifier();

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
            )
          ) {
            const { credWallet } =
              PolygonService.instance[method][blockchain][networkId];
            const creds = await credWallet.list();
            credentials.push(
              ...creds.filter(
                (cred) =>
                  !cred.type.includes(
                    VerifiableConstants.AUTH.AUTH_BJJ_CREDENTIAL_TYPE
                  )
              )
            );
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
            )
          ) {
            const { credWallet } =
              PolygonService.instance[method][blockchain][networkId];
            await credWallet.remove(id);
          }
        }
      }
    }
  }

  static async getIdentifier(): Promise<string> {
    const { method, blockchain, networkId } = PolygonService.metadata;
    const identity = (
      await PolygonService.instance[method][blockchain][
        networkId
      ].dataStorage.identity.getAllIdentities()
    )[0];

    if (!identity) {
      throw new Error('Missing identity');
    }

    return identity.did;
  }

  static async handleCredentialOffer(
    params: HandleCredentialOfferRequestParams
  ): Promise<W3CCredential[]> {
    const { credentialOffer } = params;
    const { method, blockchain, networkId } = PolygonService.metadata;

    const { packageMgr } =
      PolygonService.instance[method][blockchain][networkId];

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
      throw new Error('Error handling credential offer');
    }
  }

  static async handleAuthorizationRequest(
    params: HandleAuthorizationRequestParams
  ): Promise<void> {
    const { authorizationRequest } = params;
    const { method, blockchain, networkId } = PolygonService.metadata;

    const { authHandler } =
      PolygonService.instance[method][blockchain][networkId];

    const messageBytes = byteEncoder.encode(authorizationRequest);
    try {
      const did = DID.parse(await PolygonService.getIdentifier());

      const { token, authRequest } =
        await authHandler.handleAuthorizationRequest(did, messageBytes, {
          mediaType: PROTOCOL_CONSTANTS.MediaType.ZKPMessage,
        });

      if (!authRequest.body?.callbackUrl) {
        throw new Error('Callback url missing in authorization request');
      }

      await fetch(`${authRequest.body.callbackUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: token,
        signal: AbortSignal.timeout(15000),
      });
    } catch (e) {
      throw new Error('Error sending authorization response');
    }
  }

  static async createWallet(params: {
    method: DidMethod.Iden3 | DidMethod.PolygonId;
    blockchain: Blockchain.Ethereum | Blockchain.Polygon;
    networkId: NetworkId.Main | NetworkId.Mumbai;
  }) {
    const { method, blockchain, networkId } = params;
    const state = StorageService.get();
    const account = state[CURRENT_STATE_VERSION].currentAccount;
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

  private static async getPackageMgr(params: {
    circuitData: CircuitData;
    proofService: ProofService;
    kms: KMS;
  }) {
    const { circuitData, proofService, kms } = params;
    const authInputsHandler = new DataPrepareHandlerFunc(
      (hash: Uint8Array, did: DID, circuitId: CircuitId) =>
        proofService.generateAuthV2Inputs(hash, did, circuitId)
    );
    const verificationFn = new VerificationHandlerFunc(
      (id: string, pubSignals: string[]) =>
        proofService.verifyState(id, pubSignals)
    );
    const mapKey =
      proving.provingMethodGroth16AuthV2Instance.methodAlg.toString();

    const verificationParamMap = new Map([
      [
        mapKey,
        {
          key: circuitData.verificationKey!,
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
      _?: DIDResolutionOptions
    ): Promise<DIDResolutionResult> => {
      try {
        const response = await fetch(`${UNIRESOLVER_PROXY_URL}/${did}`);
        const data = await response.json();
        return data as DIDResolutionResult;
      } catch (error: unknown) {
        throw new Error(
          `Can't resolve did document: ${(error as Error).message}`
        );
      }
    };

    const jwsPacker = new JWSPacker(kms, { resolve: resolveDIDDocument });

    mgr.registerPackers([packer, plainPacker, jwsPacker]);

    return mgr;
  }
}

export default PolygonService;
