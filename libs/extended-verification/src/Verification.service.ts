import { Result, ResultObject } from '@blockchain-lab-um/utils';
import {
  VerifiableCredential,
  VerifiablePresentation,
  W3CVerifiableCredential,
  W3CVerifiablePresentation,
} from '@veramo/core';
import { normalizeCredential, normalizePresentation } from 'did-jwt-vc';
import { Provider } from 'ethers';

import { type Agent, createVeramoAgent } from './createVeramoAgent';

export interface CredentialVerificationResult {
  signature: {
    isValid: boolean;
    errors: string[];
  };
  schema: {
    isValid: boolean;
    errors: string[];
  };
  isExpired: boolean;
  isNotYetValid: boolean;
  isRevoked: boolean;
  ebsiTrustedIssuer: boolean;
}

export interface PresentationVerificationResult {
  signature: {
    isValid: boolean;
    errors: string[];
  };
  isExpired: boolean;
  isNotYetValid: boolean;
}

export interface VerificationResult {
  verified: boolean;
  details: {
    credentials: CredentialVerificationResult[];
    presentation: PresentationVerificationResult | null;
  };
}

export interface VerificationServiceInitOptions {
  providers?: Record<string, Provider>;
}

export class VerificationService {
  private static veramoAgent: Agent;

  static async init(options?: VerificationServiceInitOptions): Promise<void> {
    VerificationService.veramoAgent = await createVeramoAgent();
  }

  static async verify(
    data: W3CVerifiablePresentation | W3CVerifiableCredential,
    options?: { ebsiChecks?: boolean }
  ): Promise<Result<VerificationResult>> {
    const { ebsiChecks } = options || { ebsiChecks: false };

    const verificationResult: VerificationResult = {
      verified: true,
      details: {
        credentials: [],
        presentation: null,
      },
    };

    let presentation: VerifiablePresentation | null = null;
    const credentialsToVerify: VerifiableCredential[] = [];
    try {
      // Try to decode data as Veramo supported presentation format
      try {
        if (typeof data === 'string') {
          presentation = normalizePresentation(data);
        } else {
          presentation = data as VerifiablePresentation;
        }
      } catch (error) {
        // We ignore this error as we now know its not a Veramo supported presentation format
      }

      // If data is a presentation we verify it
      if (presentation?.type?.includes('VerifiablePresentation')) {
        // Presentation must contain at least one credential
        if (!presentation.verifiableCredential) {
          return ResultObject.error(
            'Presentation does not contain any credentials'
          );
        }

        // Verify the presentation
        const result = await VerificationService.veramoAgent.verifyPresentation(
          {
            presentation,
          }
        );

        const errorMessage = result.error?.message || '';

        if (!result.verified) {
          verificationResult.verified = false;
        }

        // TODO: Check dates
        verificationResult.details.presentation = {
          signature: {
            isValid: result.verified,
            errors: [
              // errorMessage,
            ],
          },
          isExpired: errorMessage.includes('expired'),
          isNotYetValid: errorMessage.includes('nbf'),
        };

        // Extract credentials from the presentation
        for (const credential of presentation.verifiableCredential) {
          credentialsToVerify.push(
            typeof credential === 'string'
              ? normalizeCredential(credential)
              : credential
          );
        }
      }

      // If there are no credentials in the presentation, we try to decode the data as a Veramo supported credential format
      if (credentialsToVerify.length === 0) {
        try {
          if (typeof data === 'string') {
            credentialsToVerify.push(
              normalizeCredential(data as W3CVerifiableCredential)
            );
          } else {
            credentialsToVerify.push(data as VerifiableCredential);
          }
        } catch (error) {
          // We ignore this error as we now know its not a Veramo supported credential format
        }
      }

      if (credentialsToVerify.length !== 0) {
        for (const credential of credentialsToVerify) {
          const result = await VerificationService.veramoAgent.verifyCredential(
            {
              credential,
            }
          );
          const errorMessage = result.error?.message || '';

          if (!result.verified) {
            verificationResult.verified = false;
          }

          const issuer =
            typeof credential.issuer === 'string'
              ? credential.issuer
              : credential.issuer.id;

          // TODO: Check if issuer is in EBSI trusted registry
          // if (issuer.startsWith('did:ebsi:')) {
          //
          // }

          // TODO: Verify schema
          verificationResult.details.credentials.push({
            signature: {
              isValid: result.verified,
              errors: [],
            },
            schema: {
              isValid: true,
              errors: [],
            },
            isExpired: errorMessage.includes('expired'),
            isNotYetValid: errorMessage.includes('nbf'),
            isRevoked: false,
            ebsiTrustedIssuer: false,
          });
        }

        // TODO: Set verification to false if any of the credentials are not valid

        return ResultObject.success(verificationResult);
      }

      // TODO: Test if it is JWZ format
      throw new Error('JWZ Support not implemented yet');
    } catch (error) {
      console.error(error);
      return ResultObject.error('Verification failed');
    }
  }
}
