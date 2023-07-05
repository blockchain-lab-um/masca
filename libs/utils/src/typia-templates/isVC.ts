import { VerifiableCredential } from '@veramo/core';
import typia from 'typia';

export const isVC = typia.createIs<VerifiableCredential>();
