import { VerifiableCredential, W3CVerifiableCredential } from '@veramo/core';
import typia from 'typia';

export const isVerifiableCredential = typia.createIs<VerifiableCredential>();
export const isW3CVerifiableCredential =
  typia.createIs<W3CVerifiableCredential>();
