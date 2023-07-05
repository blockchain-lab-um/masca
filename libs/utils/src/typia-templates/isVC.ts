import { VerifiableCredential, W3CVerifiableCredential } from '@veramo/core';
import typia from 'typia';

export const isVC = typia.createIs<VerifiableCredential>();
export const isW3CVC = typia.createIs<W3CVerifiableCredential>();
