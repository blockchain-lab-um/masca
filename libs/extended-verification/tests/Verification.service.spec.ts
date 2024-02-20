import { beforeAll, describe, it } from 'vitest';

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
  PRESENTATION_INVALID_JWT_CREDENTIAL_EXPIRED,
  PRESENTATION_INVALID_JWT_CREDENTIAL_JWT_SIGNATURE,
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

const a = [
  CREDENTIAL_VALID_EIP712,
  CREDENTIAL_INVALID_EIP712_SIGNATURE,
  CREDENTIAL_INVALID_JWT_EXP,
  CREDENTIAL_INVALID_JWT_NBF,
  CREDENTIAL_INVALID_JWT_SCHEMA,
  CREDENTIAL_INVALID_JWT_SIGNATURE,
  CREDENTIAL_VALID_JWT,
  CREDENTIAL_VALID_JWT_EXP_NBF,
  PRESENTATION_INVALID_EIP712_SIGNATURE,
  PRESENTATION_INVALID_JWT_CREDENTIAL_EXPIRED,
  PRESENTATION_INVALID_JWT_CREDENTIAL_JWT_SIGNATURE,
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
];

describe('Veramo Service', () => {
  beforeAll(async () => {
    await VerificationService.init();
  });

  describe.todo('valid cases', () => {
    describe.todo('credentials', () => {
      it.todo('valid JWT credential', async () => {});

      it.todo(' valid EIP712 credential', async () => {});

      it.todo('valid JWT credential with exp and nbf', async () => {});
    });

    describe.todo('presentations', () => {
      it.todo('valid JWT presentation', async () => {});

      it.todo('valid EIP712 presentation', async () => {});

      it.todo(
        'valid EIP712 presentation with a JWT credential',
        async () => {}
      );

      it.todo(
        'valid JWT presentation with a EIP712 credential',
        async () => {}
      );

      it.todo(
        'valid JWT presentation with 2 credentials (EIP712 and JWT)',
        async () => {}
      );

      it.todo(
        'valid EIP712 presentation with 2 credentials (EIP712 and JWT)',
        async () => {}
      );

      it.todo('valid JWT presentation with exp and nbf', async () => {});
    });
  });

  describe.todo('invalid cases', () => {
    describe.todo('credentials', () => {
      it.todo('invalid JWT credential with expired date', async () => {});

      it.todo('invalid JWT credential with nbf date', async () => {});

      it.todo('invalid JWT credential with invalid schema', async () => {});

      it.todo('invalid JWT credential with invalid signature', async () => {});

      it.todo(
        'invalid EIP712 credential with invalid signature',
        async () => {}
      );
    });

    describe.todo('presentations', () => {
      it.todo('invalid JWT presentation with expired date', async () => {});

      it.todo('invalid JWT presentation with nbf date', async () => {});

      it.todo(
        'invalid JWT presentation with invalid signature',
        async () => {}
      );

      it.todo(
        'invalid EIP712 presentation with invalid signature',
        async () => {}
      );

      it.todo(
        'invalid JWT presentation with a JWT credential with invalid signature',
        async () => {}
      );

      it.todo(
        'invalid JWT presentation with an expired JWT credential',
        async () => {}
      );
    });
  });
});
