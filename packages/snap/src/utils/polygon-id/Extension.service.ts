import {
  AuthHandler,
  CircuitId,
  CredentialStorage,
  CredentialWallet,
  DataPrepareHandlerFunc,
  EthStateStorage,
  IdentityStorage,
  IdentityWallet,
  JWSPacker,
  KMS,
  PackageManager,
  PlainPacker,
  ProofService,
  VerificationHandlerFunc,
  ZKPPacker,
} from '@0xpolygonid/js-sdk';
import { DID } from '@iden3/js-iden3-core';
import { proving } from '@iden3/js-jwz';

import { CircuitStorageInstance } from './CircuitStorage';
import { defaultEthConnectionConfig, INIT } from './constants';
import { SnapMerkleTreeStorage } from './storage';
import { WalletService } from './Wallet.service';

export class ExtensionService {
  static instance: {
    packageMgr: PackageManager;
    proofService: ProofService;
    credWallet: CredentialWallet;
    wallet: IdentityWallet;
    dataStorage: {
      credential: CredentialStorage;
      identity: IdentityStorage;
      mt: SnapMerkleTreeStorage;
      states: EthStateStorage;
    };
    authHandler: AuthHandler;
    status: string;
  };

  static async init(account: string) {
    await CircuitStorageInstance.init();

    const accountInfo = await WalletService.createWallet(account);
    const { wallet, credWallet, dataStorage, kms } = accountInfo;

    const circuitStorage = CircuitStorageInstance.getCircuitStorageInstance();

    const proofService = new ProofService(
      wallet,
      credWallet,
      circuitStorage,
      new EthStateStorage(defaultEthConnectionConfig),
      { ipfsNodeURL: 'https://ipfs.io' }
    );

    const packageMgr = await ExtensionService.getPackageMgr(
      await circuitStorage.loadCircuitData(CircuitId.AuthV2),
      proofService.generateAuthV2Inputs.bind(proofService),
      proofService.verifyState.bind(proofService),
      kms
    );

    const authHandler = new AuthHandler(packageMgr, proofService, credWallet);

    // TODO: Handle account switch
    // if (!this.instance) {
    this.instance = {
      packageMgr,
      proofService,
      credWallet,
      wallet,
      dataStorage,
      authHandler,
      status: INIT,
    };
    // }
    return this.instance;
  }

  static async getPackageMgr(
    circuitData: {
      circuitId?: string;
      wasm: any;
      verificationKey: any;
      provingKey: any;
    },
    prepareFn: {
      (
        hash: Uint8Array,
        did: DID,
        profileNonce: number,
        circuitId: CircuitId
      ): Promise<Uint8Array>;
      (
        hash: Uint8Array,
        did: DID,
        profileNonce: number,
        circuitId: CircuitId
      ): Promise<Uint8Array>;
    },
    stateVerificationFn: {
      (circuitId: string, pubSignals: string[]): Promise<boolean>;
      (id: string, pubSignals: string[]): Promise<boolean>;
    },
    kms: KMS
  ) {
    const authInputsHandler = new DataPrepareHandlerFunc(prepareFn);
    const verificationFn = new VerificationHandlerFunc(stateVerificationFn);
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
    const jwsPacker = new JWSPacker(kms);
    mgr.registerPackers([packer, plainPacker, jwsPacker]);

    return mgr;
  }

  static getExtensionServiceInstance() {
    return this.instance;
  }
}
