import { isError } from '@blockchain-lab-um/utils';
import { beforeAll, describe, expect, it } from 'vitest';

import { VerificationService } from '../src/Verification.service';
import {
  CREDENTIAL_INVALID_EIP712_SIGNATURE,
  CREDENTIAL_INVALID_JWT_EXP,
  CREDENTIAL_INVALID_JWT_NBF,
  CREDENTIAL_INVALID_JWT_SCHEMA,
  CREDENTIAL_INVALID_JWT_SIGNATURE,
  CREDENTIAL_VALID_EIP712,
  CREDENTIAL_VALID_JWT,
  CREDENTIAL_VALID_JWT_EXP_NBF,
  PRESENTATION_INVALID_EIP712_SIGNATURE,
  PRESENTATION_INVALID_JWT_CREDENTIAL_EIP712_CREDENTIAL_JWT_EXPIRED,
  PRESENTATION_INVALID_JWT_CREDENTIAL_EIP712_SIGNATURE,
  PRESENTATION_INVALID_JWT_CREDENTIAL_EXPIRED,
  PRESENTATION_INVALID_JWT_EXP,
  PRESENTATION_INVALID_JWT_NBF,
  PRESENTATION_INVALID_JWT_SIGNATURE,
  PRESENTATION_VALID_EIP712,
  PRESENTATION_VALID_EIP712_CREDENTIAL_JWT,
  PRESENTATION_VALID_EIP712_CREDENTIAL_JWT_EIP712,
  PRESENTATION_VALID_JWT,
  PRESENTATION_VALID_JWT_CREDENTIAL_EIP712,
  PRESENTATION_VALID_JWT_CREDENTIAL_JWT_EIP712,
  PRESENTATION_VALID_JWT_EXP_NBF,
} from './data';

describe('Veramo Service', () => {
  beforeAll(async () => {
    await VerificationService.init();
  });

  describe('valid cases', () => {
    describe('credentials', () => {
      it('valid JWT credential', async () => {
        const result = await VerificationService.verify(CREDENTIAL_VALID_JWT);

        if (isError(result)) {
          throw new Error(result.error);
        }

        const { data } = result;

        expect(data.verified).toBe(true);
        expect(data.details).toEqual({
          credentials: [
            {
              signature: {
                isValid: true,
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
            },
          ],
          presentation: null,
        });
      });

      it('valid EIP712 credential', async () => {
        const result = await VerificationService.verify(
          CREDENTIAL_VALID_EIP712
        );

        if (isError(result)) {
          throw new Error(result.error);
        }

        const { data } = result;

        expect(data.verified).toBe(true);
        expect(data.details).toEqual({
          credentials: [
            {
              signature: {
                isValid: true,
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
            },
          ],
          presentation: null,
        });
      });

      it('valid JWT credential with exp and nbf', async () => {
        const result = await VerificationService.verify(
          CREDENTIAL_VALID_JWT_EXP_NBF
        );

        if (isError(result)) {
          throw new Error(result.error);
        }

        const { data } = result;

        expect(data.verified).toBe(true);
        expect(data.details).toEqual({
          credentials: [
            {
              signature: {
                isValid: true,
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
            },
          ],
          presentation: null,
        });
      });
    });

    describe('presentations', () => {
      it('valid JWT presentation', async () => {
        const result = await VerificationService.verify(PRESENTATION_VALID_JWT);

        if (isError(result)) {
          throw new Error(result.error);
        }

        const { data } = result;

        expect(data.verified).toBe(true);
        expect(data.details).toEqual({
          credentials: [
            {
              signature: {
                isValid: true,
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
            },
          ],
          presentation: {
            signature: {
              isValid: true,
              errors: [],
            },
            isExpired: false,
            isNotYetValid: false,
          },
        });
      });

      it('valid EIP712 presentation', async () => {
        const result = await VerificationService.verify(
          PRESENTATION_VALID_EIP712
        );

        if (isError(result)) {
          throw new Error(result.error);
        }

        const { data } = result;

        expect(data.verified).toBe(true);
        expect(data.details).toEqual({
          credentials: [
            {
              signature: {
                isValid: true,
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
            },
          ],
          presentation: {
            signature: {
              isValid: true,
              errors: [],
            },
            isExpired: false,
            isNotYetValid: false,
          },
        });
      });

      it('valid EIP712 presentation with a JWT credential', async () => {
        const result = await VerificationService.verify(
          PRESENTATION_VALID_EIP712_CREDENTIAL_JWT
        );

        if (isError(result)) {
          throw new Error(result.error);
        }

        const { data } = result;

        expect(data.verified).toBe(true);
        expect(data.details).toEqual({
          credentials: [
            {
              signature: {
                isValid: true,
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
            },
          ],
          presentation: {
            signature: {
              isValid: true,
              errors: [],
            },
            isExpired: false,
            isNotYetValid: false,
          },
        });
      });

      it('valid JWT presentation with a EIP712 credential', async () => {
        const result = await VerificationService.verify(
          PRESENTATION_VALID_JWT_CREDENTIAL_EIP712
        );

        if (isError(result)) {
          throw new Error(result.error);
        }

        const { data } = result;

        expect(data.verified).toBe(true);
        expect(data.details).toEqual({
          credentials: [
            {
              signature: {
                isValid: true,
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
            },
          ],
          presentation: {
            signature: {
              isValid: true,
              errors: [],
            },
            isExpired: false,
            isNotYetValid: false,
          },
        });
      });

      it('valid JWT presentation with 2 credentials (EIP712 and JWT)', async () => {
        const result = await VerificationService.verify(
          PRESENTATION_VALID_JWT_CREDENTIAL_JWT_EIP712
        );

        if (isError(result)) {
          throw new Error(result.error);
        }

        const { data } = result;

        expect(data.verified).toBe(true);
        expect(data.details).toEqual({
          credentials: [
            {
              signature: {
                isValid: true,
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
            },
            {
              signature: {
                isValid: true,
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
            },
          ],
          presentation: {
            signature: {
              isValid: true,
              errors: [],
            },
            isExpired: false,
            isNotYetValid: false,
          },
        });
      });

      it('valid EIP712 presentation with 2 credentials (EIP712 and JWT)', async () => {
        const result = await VerificationService.verify(
          PRESENTATION_VALID_EIP712_CREDENTIAL_JWT_EIP712
        );

        if (isError(result)) {
          throw new Error(result.error);
        }

        const { data } = result;

        expect(data.verified).toBe(true);
        expect(data.details).toEqual({
          credentials: [
            {
              signature: {
                isValid: true,
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
            },
            {
              signature: {
                isValid: true,
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
            },
          ],
          presentation: {
            signature: {
              isValid: true,
              errors: [],
            },
            isExpired: false,
            isNotYetValid: false,
          },
        });
      });

      it('valid JWT presentation with exp and nbf', async () => {
        const result = await VerificationService.verify(
          PRESENTATION_VALID_JWT_EXP_NBF
        );

        if (isError(result)) {
          throw new Error(result.error);
        }

        const { data } = result;

        expect(data.verified).toBe(true);
        expect(data.details).toEqual({
          credentials: [
            {
              signature: {
                isValid: true,
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
            },
          ],
          presentation: {
            signature: {
              isValid: true,
              errors: [],
            },
            isExpired: false,
            isNotYetValid: false,
          },
        });
      });
    });
  });

  describe('invalid cases', () => {
    describe('credentials', () => {
      it('invalid JWT credential with expired date', async () => {
        const result = await VerificationService.verify(
          CREDENTIAL_INVALID_JWT_EXP
        );

        if (isError(result)) {
          throw new Error(result.error);
        }

        const { data } = result;

        expect(data.verified).toBe(false);
        expect(data.details).toEqual({
          credentials: [
            {
              signature: {
                isValid: false,
                errors: [],
              },
              schema: {
                isValid: true,
                errors: [],
              },
              isExpired: true,
              isNotYetValid: false,
              isRevoked: false,
              ebsiTrustedIssuer: false,
            },
          ],
          presentation: null,
        });
      });

      it('invalid JWT credential with nbf date', async () => {
        const result = await VerificationService.verify(
          CREDENTIAL_INVALID_JWT_NBF
        );

        if (isError(result)) {
          throw new Error(result.error);
        }

        const { data } = result;

        expect(data.verified).toBe(false);
        expect(data.details).toEqual({
          credentials: [
            {
              signature: {
                isValid: false,
                errors: [],
              },
              schema: {
                isValid: true,
                errors: [],
              },
              isExpired: false,
              isNotYetValid: true,
              isRevoked: false,
              ebsiTrustedIssuer: false,
            },
          ],
          presentation: null,
        });
      });

      it.todo('invalid JWT credential with invalid schema', async () => {
        const result = await VerificationService.verify(
          CREDENTIAL_INVALID_JWT_SCHEMA
        );

        if (isError(result)) {
          throw new Error(result.error);
        }

        const { data } = result;

        expect(data.verified).toBe(false);
        expect(data.details).toEqual({
          credentials: [
            {
              signature: {
                isValid: true,
                errors: [],
              },
              schema: {
                isValid: false,
                errors: [],
              },
              isExpired: false,
              isNotYetValid: false,
              isRevoked: false,
              ebsiTrustedIssuer: false,
            },
          ],
          presentation: null,
        });
      });

      it('invalid JWT credential with invalid signature', async () => {
        const result = await VerificationService.verify(
          CREDENTIAL_INVALID_JWT_SIGNATURE
        );

        if (isError(result)) {
          throw new Error(result.error);
        }

        const { data } = result;

        expect(data.verified).toBe(false);
        expect(data.details).toEqual({
          credentials: [
            {
              signature: {
                isValid: false,
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
            },
          ],
          presentation: null,
        });
      });

      it('invalid EIP712 credential with invalid signature', async () => {
        const result = await VerificationService.verify(
          CREDENTIAL_INVALID_EIP712_SIGNATURE
        );

        if (isError(result)) {
          throw new Error(result.error);
        }

        const { data } = result;

        expect(data.verified).toBe(false);
        expect(data.details).toEqual({
          credentials: [
            {
              signature: {
                isValid: false,
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
            },
          ],
          presentation: null,
        });
      });
    });

    describe('presentations', () => {
      it('invalid JWT presentation with expired date', async () => {
        const result = await VerificationService.verify(
          PRESENTATION_INVALID_JWT_EXP
        );

        if (isError(result)) {
          throw new Error(result.error);
        }

        const { data } = result;

        expect(data.verified).toBe(false);
        expect(data.details).toEqual({
          credentials: [
            {
              signature: {
                isValid: true,
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
            },
          ],
          presentation: {
            signature: {
              isValid: false,
              errors: [],
            },
            isExpired: true,
            isNotYetValid: false,
          },
        });
      });

      it('invalid JWT presentation with nbf date', async () => {
        const result = await VerificationService.verify(
          PRESENTATION_INVALID_JWT_NBF
        );

        if (isError(result)) {
          throw new Error(result.error);
        }

        const { data } = result;

        expect(data.verified).toBe(false);
        expect(data.details).toEqual({
          credentials: [
            {
              signature: {
                isValid: true,
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
            },
          ],
          presentation: {
            signature: {
              isValid: false,
              errors: [],
            },
            isExpired: false,
            isNotYetValid: true,
          },
        });
      });

      it('invalid JWT presentation with invalid signature', async () => {
        const result = await VerificationService.verify(
          PRESENTATION_INVALID_JWT_SIGNATURE
        );

        if (isError(result)) {
          throw new Error(result.error);
        }

        const { data } = result;

        expect(data.verified).toBe(false);
        expect(data.details).toEqual({
          credentials: [
            {
              signature: {
                isValid: true,
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
            },
          ],
          presentation: {
            signature: {
              isValid: false,
              errors: [],
            },
            isExpired: false,
            isNotYetValid: false,
          },
        });
      });

      it('invalid EIP712 presentation with invalid signature', async () => {
        const result = await VerificationService.verify(
          PRESENTATION_INVALID_EIP712_SIGNATURE
        );

        if (isError(result)) {
          throw new Error(result.error);
        }

        const { data } = result;

        expect(data.verified).toBe(false);
        expect(data.details).toEqual({
          credentials: [
            {
              signature: {
                isValid: true,
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
            },
          ],
          presentation: {
            signature: {
              isValid: false,
              errors: [],
            },
            isExpired: false,
            isNotYetValid: false,
          },
        });
      });

      it('invalid JWT presentation with a EIP712 credential with invalid signature', async () => {
        const result = await VerificationService.verify(
          PRESENTATION_INVALID_JWT_CREDENTIAL_EIP712_SIGNATURE
        );

        if (isError(result)) {
          throw new Error(result.error);
        }

        const { data } = result;

        expect(data.verified).toBe(false);
        expect(data.details).toEqual({
          credentials: [
            {
              signature: {
                isValid: false,
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
            },
          ],
          presentation: {
            signature: {
              isValid: true,
              errors: [],
            },
            isExpired: false,
            isNotYetValid: false,
          },
        });
      });

      it('invalid JWT presentation with an expired JWT credential', async () => {
        const result = await VerificationService.verify(
          PRESENTATION_INVALID_JWT_CREDENTIAL_EXPIRED
        );

        if (isError(result)) {
          throw new Error(result.error);
        }

        const { data } = result;

        expect(data.verified).toBe(false);
        expect(data.details).toEqual({
          credentials: [
            {
              signature: {
                isValid: false,
                errors: [],
              },
              schema: {
                isValid: true,
                errors: [],
              },
              isExpired: true,
              isNotYetValid: false,
              isRevoked: false,
              ebsiTrustedIssuer: false,
            },
          ],
          presentation: {
            signature: {
              isValid: true,
              errors: [],
            },
            isExpired: false,
            isNotYetValid: false,
          },
        });
      });

      it('invalid JWT presentation with an expired JWT credential and a valid EIP712 credential', async () => {
        const result = await VerificationService.verify(
          PRESENTATION_INVALID_JWT_CREDENTIAL_EIP712_CREDENTIAL_JWT_EXPIRED
        );

        if (isError(result)) {
          throw new Error(result.error);
        }

        const { data } = result;

        expect(data.verified).toBe(false);
        expect(data.details).toEqual({
          credentials: [
            {
              signature: {
                isValid: true,
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
            },
            {
              signature: {
                isValid: false,
                errors: [],
              },
              schema: {
                isValid: true,
                errors: [],
              },
              isExpired: true,
              isNotYetValid: false,
              isRevoked: false,
              ebsiTrustedIssuer: false,
            },
          ],
          presentation: {
            signature: {
              isValid: true,
              errors: [],
            },
            isExpired: false,
            isNotYetValid: false,
          },
        });
      });
    });
  });
});
