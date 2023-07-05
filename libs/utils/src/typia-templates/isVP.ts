import { VerifiablePresentation } from '@veramo/core';
import typia from 'typia';

export const isVerifiablePresentation =
  typia.createIs<VerifiablePresentation>();
