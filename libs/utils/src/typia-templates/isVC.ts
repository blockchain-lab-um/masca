import { VerifiableCredential } from '@veramo/core';
import typia from 'typia';

export const isVerifiableCredential = typia.createIs<VerifiableCredential>();
