import { DIDResolutionResult } from '@veramo/core';

import { readJSON } from '../../helpers/readJSON';

interface DIDResolutionResultExample extends DIDResolutionResult {
  did: string;
}

const CHEQD = readJSON(
  import.meta.url,
  'cheqd.json'
) as DIDResolutionResultExample;
const EBSI = readJSON(
  import.meta.url,
  'ebsi.json'
) as DIDResolutionResultExample;
const ENS = readJSON(import.meta.url, 'ens.json') as DIDResolutionResultExample;
const ETHR = readJSON(
  import.meta.url,
  'ethr.json'
) as DIDResolutionResultExample;
const ION = readJSON(import.meta.url, 'ion.json') as DIDResolutionResultExample;
const KEY = readJSON(import.meta.url, 'key.json') as DIDResolutionResultExample;
const WEB = readJSON(import.meta.url, 'web.json') as DIDResolutionResultExample;

export { CHEQD, EBSI, ENS, ETHR, ION, KEY, WEB };
