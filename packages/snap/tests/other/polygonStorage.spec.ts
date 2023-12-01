import {
  BjjProvider,
  byteEncoder,
  CredentialStatusResolverRegistry,
  CredentialStatusType,
  CredentialStorage,
  CredentialWallet,
  Identity,
  IdentityStorage,
  IdentityWallet,
  InMemoryDataSource,
  InMemoryMerkleTreeStorage,
  InMemoryPrivateKeyStore,
  IStateStorage,
  KMS,
  KmsKeyType,
  Profile,
  RHSResolver,
  RootInfo,
  StateProof,
  VerifiableConstants,
} from '@0xpolygonid/js-sdk';
import { MascaState } from '@blockchain-lab-um/masca-types';
import { isError, Result } from '@blockchain-lab-um/utils';
import { Blockchain, DID, DidMethod, NetworkId } from '@iden3/js-iden3-core';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsProvider } from '@metamask/snaps-sdk';
import { getJsonSize } from '@metamask/utils';
import cloneDeep from 'lodash.clonedeep';
import { SetupServer, setupServer } from 'msw/node';
import { afterAll, beforeAll, describe, it, vi } from 'vitest';

import { onRpcRequest } from '../../src';
import CircuitStorageService from '../../src/polygon-id/CircuitStorage.service';
import { RHS_URL } from '../../src/polygon-id/constants';
import StorageService from '../../src/storage/Storage.service';
import { account } from '../data/constants';
import { getDefaultSnapState } from '../data/defaultSnapState';
import { createMockSnap, SnapMock } from '../helpers/snapMock';
import { mswHandlers } from './mswHandlers';

const issueCredential = async (
  wallet: IdentityWallet,
  issuerDID: DID,
  subjectDID: DID
) => {
  const claimReq = {
    credentialSchema:
      'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json/kyc-nonmerklized.json',
    type: 'KYCAgeCredential',
    credentialSubject: {
      id: subjectDID.string(),
      birthday: 19960424,
      documentType: 99,
    },
    expiration: 2793526400,
    revocationOpts: {
      type: CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
      nonce: 1000,
      id: 'https://rhs-staging.polygonid.me',
    },
  };

  const credential = await wallet.issueCredential(issuerDID, claimReq);

  return credential;
};

const createPolygonIDWallet = async (): Promise<{
  identityWallet: IdentityWallet;
  issuerDID: DID;
}> => {
  await CircuitStorageService.init();
  const memoryKeyStore = new InMemoryPrivateKeyStore();
  const bjjProvider = new BjjProvider(KmsKeyType.BabyJubJub, memoryKeyStore);
  const kms = new KMS();
  kms.registerKeyProvider(KmsKeyType.BabyJubJub, bjjProvider);

  const mockStateStorage: IStateStorage = {
    getLatestStateById: async () => {
      throw new Error(VerifiableConstants.ERRORS.IDENTITY_DOES_NOT_EXIST);
    },
    publishState: async () =>
      '0xc837f95c984892dbcc3ac41812ecb145fedc26d7003202c50e1b87e226a9b33c',
    getGISTProof: (): Promise<StateProof> =>
      Promise.resolve({
        root: 0n,
        existence: false,
        siblings: [],
        index: 0n,
        value: 0n,
        auxExistence: false,
        auxIndex: 0n,
        auxValue: 0n,
      }),
    getGISTRootInfo: (): Promise<RootInfo> =>
      Promise.resolve({
        root: 0n,
        replacedByRoot: 0n,
        createdAtTimestamp: 0n,
        replacedAtTimestamp: 0n,
        createdAtBlock: 0n,
        replacedAtBlock: 0n,
      }),
  };

  const dataStorage = {
    credential: new CredentialStorage(new InMemoryDataSource()),
    identity: new IdentityStorage(
      new InMemoryDataSource<Identity>(),
      new InMemoryDataSource<Profile>()
    ),
    mt: new InMemoryMerkleTreeStorage(40),
    states: mockStateStorage,
  };

  const resolvers = new CredentialStatusResolverRegistry();
  resolvers.register(
    CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
    new RHSResolver(dataStorage.states)
  );
  const credWallet = new CredentialWallet(dataStorage, resolvers);
  const identityWallet = new IdentityWallet(kms, dataStorage, credWallet);

  const seedPhrase: Uint8Array = byteEncoder.encode(
    'seedseedseedseedseedseedseedseed'
  );

  const opts = (seed: Uint8Array) => ({
    method: DidMethod.Iden3,
    blockchain: Blockchain.Polygon,
    networkId: NetworkId.Mumbai,
    seed,
    revocationOpts: {
      type: CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
      id: RHS_URL,
    },
  });

  const { did: issuerDID } = await identityWallet.createIdentity(
    opts(seedPhrase)
  );

  return { identityWallet, issuerDID };
};

describe('Utils [ceramic]', () => {
  let snapMock: SnapsProvider & SnapMock;
  let subjectDID: DID;
  let mswServer: SetupServer;

  beforeAll(async () => {
    mswServer = setupServer();
    mswServer.listen({ onUnhandledRequest: 'error' });
    // mswServer.events.on('request:start', (req) => {});

    mswServer.events.on('response:bypass', (res) => {
      const { request } = res;
      console.log(request.url);
      console.log(request.method);
      request
        .json()
        .then((data) => console.log(data))
        .catch(console.log);

      res.response
        .json()
        .then((data) => console.log(data))
        .catch(console.log);
    });

    mswServer.use(...mswHandlers);

    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: getDefaultSnapState(account),
    });
    snapMock.rpcMocks.eth_chainId = vi.fn().mockResolvedValue('0x13881');

    global.snap = snapMock;
    global.ethereum = snapMock as unknown as MetaMaskInpageProvider;

    await StorageService.init();

    // Switch to did:polygonid
    const resSwitchMethod = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'switchDIDMethod',
        params: { didMethod: 'did:polygonid' },
      },
    })) as Result<boolean>;

    if (isError(resSwitchMethod)) {
      throw new Error(resSwitchMethod.error);
    }

    // Get the current DID
    const resGetDID = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'getDID',
      },
    })) as Result<string>;

    if (isError(resGetDID)) {
      throw new Error(resGetDID.error);
    }

    subjectDID = DID.parse(resGetDID.data);
  });

  afterAll(async () => {
    mswServer.close();
  });

  it('Test storage requirements for Polygon ID', async () => {
    const initialState = snapMock.rpcMocks.snap_manageState({
      operation: 'get',
    }) as MascaState;

    const polygonBaseStateSize = getJsonSize(
      initialState.v1.accountState[initialState.v1.currentAccount].polygon.state
    );

    const { identityWallet, issuerDID } = await createPolygonIDWallet();

    console.log(
      'Num, State, Identities, Credentials, MerkleTree, MerkleTreeMeta'
    );

    for (let idx = 0; idx < 100; idx += 1) {
      const credential = await issueCredential(
        identityWallet,
        issuerDID,
        subjectDID
      );

      // Save credential to snap storage
      const resSaveCredential = (await onRpcRequest({
        origin: 'localhost',
        request: {
          id: 'test-id',
          jsonrpc: '2.0',
          method: 'saveCredential',
          params: { verifiableCredential: cloneDeep(credential) } as any,
        },
      })) as Result<boolean>;

      if (isError(resSaveCredential)) {
        throw new Error(resSaveCredential.error);
      }

      const state = snapMock.rpcMocks.snap_manageState({
        operation: 'get',
      }) as MascaState;

      const polygonState =
        state.v1.accountState[state.v1.currentAccount].polygon.state;
      const polygonMumbaiState = polygonState.polygonid.polygon.mumbai;

      console.log(
        `${idx}, ${
          getJsonSize(polygonState) - polygonBaseStateSize
        }, ${getJsonSize(polygonMumbaiState.identities)}, ${getJsonSize(
          polygonMumbaiState.credentials
        )}, ${getJsonSize(polygonMumbaiState.merkleTree)}, ${getJsonSize(
          polygonMumbaiState.merkleTreeMeta
        )}`
      );
    }
  });
});
