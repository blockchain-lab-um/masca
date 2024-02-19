import { W3CCredential } from '@0xpolygonid/js-sdk';
import { isError, Result } from '@blockchain-lab-um/utils';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { SnapsProvider } from '@metamask/snaps-sdk';
import { VerifiableCredential, VerifiablePresentation } from '@veramo/core';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { onRpcRequest } from '../../src';
import PolygonService from '../../src/polygon-id/Polygon.service';
import StorageService from '../../src/storage/Storage.service';
import VeramoService, { type Agent } from '../../src/veramo/Veramo.service';
import { account } from '../data/constants';
import { EXAMPLE_VC_PAYLOAD } from '../data/credentials';
import { getDefaultSnapState } from '../data/defaultSnapState';
import { createTestVCs } from '../helpers/generateTestVCs';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

describe('verifyData', () => {
  let snapMock: SnapsProvider & SnapMock;
  let agent: Agent;
  let generatedVC: VerifiableCredential;
  const polyVc =
    '{"id":"urn:uuid:a63334be-95c1-11ee-8227-0242ac1d0004","@context":["https://www.w3.org/2018/credentials/v1","https://schema.iden3.io/core/jsonld/iden3proofs.jsonld","https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v4.jsonld"],"type":["VerifiableCredential","KYCAgeCredential"],"credentialSubject":{"birthday":19960424,"documentType":162153,"id":"did:polygonid:polygon:mumbai:2qKbog5mQfBzx1S12p7nXhioZ9Nq3AxF7Vxh1cvY8e","type":"KYCAgeCredential"},"issuer":"did:polygonid:polygon:mumbai:2qFGtDk2SyTLJgUx576mn2peqeFtWmhsSvWLoAnom4","credentialSchema":{"id":"https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json/KYCAgeCredential-v4.json","type":"JsonSchema2023"},"credentialStatus":{"id":"https://rhs-staging.polygonid.me/node?state=950855dccf9154073d7fc101c8c9c072536d1eb3f428c0ff7efc2cbf745be01e","revocationNonce":2799395774,"statusIssuer":{"id":"https://dev.polygonid.me/api/v1/identities/did%3Apolygonid%3Apolygon%3Amumbai%3A2qFGtDk2SyTLJgUx576mn2peqeFtWmhsSvWLoAnom4/claims/revocation/status/2799395774","revocationNonce":2799395774,"type":"SparseMerkleTreeProof"},"type":"Iden3ReverseSparseMerkleTreeProof"},"expirationDate":"2030-01-01T00:00:00Z","issuanceDate":"2023-12-08T12:02:24.466416452Z","proof":[{"coreClaim":"508991bcf0336ba99935ef498d797ec92a00000000000000000000000000000002129d21dfcb73b3c4152ec2b7d4aa5dd60b5bd60dc6c9f1505ca4ea2a000f001580f3635f93488aacbafc46b17e68c0a6b90fa0caf7efbb871da56f2b4cea2f0000000000000000000000000000000000000000000000000000000000000000be63dba60000000080d8db700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","issuerData":{"authCoreClaim":"cca3371a6cb1b715004407e325bd993c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000028b90c2d112ab2b716cf827b0069c5f78a5de494cf311070aaa2595acc0ea318a1b085fe9c16aa6efc40ef141f7d9903e93205b14355634b0890698697f0191f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","credentialStatus":{"id":"https://dev.polygonid.me/api/v1/identities/did%3Apolygonid%3Apolygon%3Amumbai%3A2qFGtDk2SyTLJgUx576mn2peqeFtWmhsSvWLoAnom4/claims/revocation/status/0","revocationNonce":0,"type":"SparseMerkleTreeProof"},"id":"did:polygonid:polygon:mumbai:2qFGtDk2SyTLJgUx576mn2peqeFtWmhsSvWLoAnom4","mtp":{"existence":true,"siblings":[]},"state":{"claimsTreeRoot":"da90d0979932880a70f70c975f23c9fd4d935b6680222bc5d62783abc4c48329","value":"27739429f13dd5a4091c4c31d78481706a836a255df14f78542a1598c6ed112e"}},"signature":"e08206f0c54c300deaaf79ff3b65821779b7d422db5e7de5ef720e981da86a90e7a9afda9ce2910c1accacbebaa5768e5d164ba6f859eaa8b44283fb69677f00","type":"BJJSignature2021"},{"coreClaim":"508991bcf0336ba99935ef498d797ec92a00000000000000000000000000000002129d21dfcb73b3c4152ec2b7d4aa5dd60b5bd60dc6c9f1505ca4ea2a000f001580f3635f93488aacbafc46b17e68c0a6b90fa0caf7efbb871da56f2b4cea2f0000000000000000000000000000000000000000000000000000000000000000be63dba60000000080d8db700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","issuerData":{"id":"did:polygonid:polygon:mumbai:2qFGtDk2SyTLJgUx576mn2peqeFtWmhsSvWLoAnom4","state":{"blockNumber":43329052,"blockTimestamp":1702037008,"claimsTreeRoot":"13d24e930474f83fa18bd9712293483c163758d73c4d9127aeab3e469151c907","revocationTreeRoot":"070fc885e098609853caf9ee52fa875758152a90800cef6432e107ec68d93516","rootOfRoots":"5a378fcf12c693e8976cfe6be5fbfc808520c619cebeb5b8f6669f6997ea851a","txId":"0x10c4dcfd709ad289fdde8fd12ed5904a8a937053229dc9261875aebd7a898ee5","value":"a965820513eda3ff3b95b901639d332644bb2e8d45351fe0fa7f47994d592610"}},"mtp":{"existence":true,"siblings":["2275591949694372442151938699590458772613147807589264763685563813364684799170","17444787870410263606820161126319265560667265398364342340853420456364655130426","692135462434963774166085710508860293279772166990562787689628078094891318553","8103684957772256649038311659935946470702058381478241327507864515728233584199","15228498575903500993285206505824222193912186459492593256792299352045897767574","20141289257610677266098469480521257295738714532228790332244488952856988741130"]},"type":"Iden3SparseMerkleTreeProof"}]}';

  beforeAll(async () => {
    snapMock = createMockSnap();
    snapMock.rpcMocks.snap_manageState({
      operation: 'update',
      newState: getDefaultSnapState(account),
    });
    snapMock.rpcMocks.snap_dialog.mockReturnValue(true);
    global.snap = snapMock;
    global.ethereum = snapMock as unknown as MetaMaskInpageProvider;

    await StorageService.init();
    agent = await VeramoService.createAgent();

    // Create test identifier for issuing the VC
    const identifier = await agent.didManagerCreate({
      provider: 'did:ethr',
      kms: 'snap',
    });

    // Create test VC
    const res = await createTestVCs({
      agent,
      proofFormat: 'jwt',
      payload: {
        issuer: identifier.did,
        ...EXAMPLE_VC_PAYLOAD,
      },
    });
    generatedVC = res.exampleVeramoVCJWT;

    // Created VC should be valid
    const verifyResult = await agent.verifyCredential({
      credential: generatedVC,
    });

    if (verifyResult.verified === false) {
      throw new Error('Generated VC is not valid');
    }
  });

  beforeEach(async () => {
    await agent.clear({ options: { store: ['snap', 'ceramic'] } });
  });

  it('should succeed verifiying a VC', async () => {
    const verifyDataResult = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'verifyData',
        params: {
          credential: generatedVC,
        },
      },
    })) as Result<boolean>;

    if (isError(verifyDataResult)) {
      throw new Error(verifyDataResult.error);
    }

    expect(verifyDataResult.data).toBe(true);
    expect.assertions(1);
  });

  it('should succeed verifying a VP', async () => {
    const switchMethodResult = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'switchDIDMethod',
        params: {
          didMethod: 'did:key',
        },
      },
    })) as Result<string>;

    if (isError(switchMethodResult)) {
      throw new Error(switchMethodResult.error);
    }

    const createPresentationResult = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'createPresentation',
        params: {
          vcs: [generatedVC],
        },
      },
    })) as Result<VerifiablePresentation>;

    if (isError(createPresentationResult)) {
      throw new Error(createPresentationResult.error);
    }

    const verified = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'verifyData',
        params: {
          presentation: createPresentationResult.data,
        },
      },
    })) as Result<boolean>;

    if (isError(verified)) {
      throw new Error(verified.error);
    }

    expect(verified.data).toBe(true);
    expect.assertions(1);
  });

  it.todo('should succeed verifying a VP with domain and challenge');

  it('should suceed checking revocation status of polygonid credential', async () => {
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

    await PolygonService.init();
    await PolygonService.createOrImportIdentity();
    const status = await PolygonService.getRevocationStatus(
      JSON.parse(polyVc) as W3CCredential
    );
    console.log(
      `🚀 ~ file: verifyData.spec.ts:39 ~ beforeAll ~ status:`,
      status
    );
  });
});
