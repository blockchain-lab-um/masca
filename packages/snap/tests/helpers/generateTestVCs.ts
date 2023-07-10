import type {
  CredentialPayload,
  ProofFormat,
  VerifiableCredential,
} from '@veramo/core';

import type { Agent } from '../../src/veramo/Veramo.service';

/**
 * Test credentials
 * @param exampleVeramoVCJWT - Veramo VC JWT
 */
type TestCredentials = {
  exampleVeramoVCJWT: VerifiableCredential;
};

/**
 * Parameters for createTestVCs
 * @param agent - Veramo agent
 * @param proofFormat - proof format to use for VC creation
 * @param payload.issuer - issuer of the VC
 * @param payload.credentialSubject - subject of the VC
 * @param payload.type - type of the VC
 * @param payload.'@context' - context of the VC
 * @param payload.issuanceDate - issuance date of the VC
 * @param payload.expirationDate - expiration date of the VC
 * @param payload.credentialStatus - credential status of the VC
 * @param payload.id - id of the VC
 */
type CreateTestVCsParams = {
  agent: Agent;
  proofFormat: ProofFormat;
  payload: CredentialPayload;
};

/**
 * Options for createTestVCs
 * @param keyRef - key reference to use for VC creation
 */
type CreateTestVCsOptions = {
  keyRef?: string;
};

/**
 * Creates a set of valid VCs for testing purposes
 * @param {CreateTestVCsParams} args
 * @param {CreateTestVCsOptions} options
 * @returns TestCredentials object
 */
export async function createTestVCs(
  args: CreateTestVCsParams,
  options?: CreateTestVCsOptions
): Promise<TestCredentials> {
  const { agent, proofFormat, payload } = args;

  const exampleVeramoVCJWT: VerifiableCredential =
    await agent.createVerifiableCredential({
      ...(options?.keyRef && { keyRef: options.keyRef }),
      proofFormat,
      credential: payload,
    });

  return { exampleVeramoVCJWT };
}
