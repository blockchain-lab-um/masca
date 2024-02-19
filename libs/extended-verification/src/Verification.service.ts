import { Result, ResultObject } from '@blockchain-lab-um/utils';
import {
  VerifiableCredential,
  VerifiablePresentation,
  W3CVerifiableCredential,
  W3CVerifiablePresentation,
} from '@veramo/core';
import {
  decodeCredentialToObject,
  decodePresentationToObject,
} from '@veramo/utils';
import { Provider } from 'ethers';

import { createVeramoAgent, type Agent } from './createVeramoAgent';

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
    this.veramoAgent = await createVeramoAgent();
  }

  static async verify(
    data: W3CVerifiablePresentation | W3CVerifiableCredential,
    options?: { ebsiChecks?: boolean }
  ): Promise<Result<VerificationResult>> {
    const { ebsiChecks } = options || { ebsiChecks: false };

    const verificationResult: VerificationResult = {
      verified: false,
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
        presentation = decodePresentationToObject(
          data as W3CVerifiablePresentation
        );
      } catch (error) {
        // We ignore this error as we now know its not a Veramo supported presentation format
      }

      // If data is a presentation we verify it
      if (presentation) {
        // Presentation must contain at least one credential
        if (!presentation.verifiableCredential) {
          return ResultObject.error(
            'Presentation does not contain any credentials'
          );
        }

        // Verify the presentation
        const result = await this.veramoAgent.verifyPresentation({
          presentation,
        });

        // TODO: Check dates
        verificationResult.details.presentation = {
          signature: {
            isValid: result.verified,
            errors: [],
          },
          isExpired: false,
          isNotYetValid: false,
        };

        // Extract credentials from the presentation
        for (const credential of presentation.verifiableCredential) {
          credentialsToVerify.push(decodeCredentialToObject(credential));
        }
      }

      // If there are no credentials in the presentation, we try to decode the data as a Veramo supported credential format
      if (credentialsToVerify.length === 0) {
        try {
          credentialsToVerify.push(
            decodeCredentialToObject(data as W3CVerifiableCredential)
          );
        } catch (error) {
          // We ignore this error as we now know its not a Veramo supported credential format
        }
      }

      if (credentialsToVerify.length !== 0) {
        for (const credential of credentialsToVerify) {
          const result = await this.veramoAgent.verifyCredential({
            credential,
          });

          const issuer =
            typeof credential.issuer === 'string'
              ? credential.issuer
              : credential.issuer.id;

          if (issuer.startsWith('did:ebsi:')) {
            // TODO: Check if issuer is in EBSI trusted registry
          }

          // TODO: Verify schema
          // TODO: Check dates
          verificationResult.details.credentials.push({
            signature: {
              isValid: result.verified,
              errors: [],
            },
            schema: {
              isValid: true,
              errors: [],
            },
            isExpired: false,
            isNotYetValid: false,
            isRevoked: false,
            ebsiTrustedIssuer: false,
          });
        }

        // TODO: Set verification to false if any of the credentials are not valid
        return ResultObject.success(verificationResult);
      }

      // TODO: Test if it is JWZ format}
      throw new Error('JWZ Support not implemented yet');
    } catch (error) {
      console.error(error);
      return ResultObject.error('Verification failed');
    }
  }
}
