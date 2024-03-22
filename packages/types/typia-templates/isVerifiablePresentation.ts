import type {
  VerifiablePresentation,
  W3CVerifiablePresentation,
} from '@veramo/core';
import typia from 'typia';

export const isVerifiablePresentation =
  typia.createIs<VerifiablePresentation>();
export const isW3CVerifiablePresentation =
  typia.createIs<W3CVerifiablePresentation>();
