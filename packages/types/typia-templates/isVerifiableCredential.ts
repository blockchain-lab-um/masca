import { W3CCredential } from '@0xpolygonid/js-sdk';
import { VerifiableCredential, W3CVerifiableCredential } from '@veramo/core';
import typia from 'typia';

export const isVerifiableCredential = typia.createIs<VerifiableCredential>();
export const isW3CVerifiableCredential =
  typia.createIs<W3CVerifiableCredential>();
export const isW3CCredential = typia.createIs<W3CCredential>();
