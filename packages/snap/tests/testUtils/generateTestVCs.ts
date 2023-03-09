import type { ProofFormat, VerifiableCredential } from '@veramo/core';
import type { Agent } from 'src/veramo/setup';

/**
 * Test credentials
 * @param exampleVeramoVCJWT - Veramo VC JWT
 */
type TestCredentials = {
  exampleVeramoVCJWT: VerifiableCredential;
};

/**
 * Parameters for createValidVCs
 * @param agent - Veramo agent
 * @param issuer - Issuer DID
 * @param subject - Credential subject
 * @param id - Credential ID
 */
type CreateValidVCsParams = {
  agent: Agent;
  issuer: string;
  subject: { [x: string]: string };
  proofFormat?: ProofFormat;
  type?: ['VerifiableCredential', string];
  id?: string;
};

/**
 * Options for createValidVCs
 * @param keyRef - key reference to use for VC creation
 */
type CreateValidVCsOptions = {
  keyRef?: string;
};

/**
 * Creates a set of valid VCs for testing purposes
 * @param {CreateValidVCsParams} args
 * @param {CreateValidVCsOptions} options
 * @returns TestCredentials object
 */
export async function createValidVCs(
  args: CreateValidVCsParams,
  options?: CreateValidVCsOptions
): Promise<TestCredentials> {
  const { agent, issuer, subject, id, type, proofFormat } = args;
  const exampleVeramoVCJWT: VerifiableCredential =
    await agent.createVerifiableCredential({
      ...(options?.keyRef && { keyRef: options.keyRef }),
      proofFormat: proofFormat || 'jwt',
      credential: {
        id: id || 'test-vc-jwt',
        type: type || ['VerifiableCredential', 'Custom'],
        issuer,
        credentialSubject: subject,
      },
    });
  return { exampleVeramoVCJWT } as TestCredentials;
}
