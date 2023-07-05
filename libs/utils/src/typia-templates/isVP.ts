import {
  VerifiablePresentation,
  W3CVerifiablePresentation,
} from '@veramo/core';
import typia from 'typia';

export const isVP = typia.createIs<VerifiablePresentation>();
export const isW3CVP = typia.createIs<W3CVerifiablePresentation>();
