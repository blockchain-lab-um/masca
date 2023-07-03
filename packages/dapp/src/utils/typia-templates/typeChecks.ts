import { VerifiableCredential } from '@veramo/core';
import typia from 'typia';

// Import a type and generate a type check function
export const checkVCType = typia.createIs<VerifiableCredential>();
