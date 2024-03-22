import type { VerifiableCredential } from '@veramo/core';

import { readJSON } from '../../helpers/readJSON';

const EXAMPLE_VC = readJSON(
  import.meta.url,
  'exampleJWT.json'
) as VerifiableCredential;
const EXAMPLE_VC2 = readJSON(
  import.meta.url,
  'exampleJWT_2.json'
) as VerifiableCredential;
const EXAMPLE_VC_LDS = readJSON(
  import.meta.url,
  'exampleJSONLD.json'
) as VerifiableCredential;
const EXAMPLE_VC_EIP712 = readJSON(
  import.meta.url,
  'exampleEIP712.json'
) as VerifiableCredential;

export { EXAMPLE_VC, EXAMPLE_VC2, EXAMPLE_VC_LDS, EXAMPLE_VC_EIP712 };
