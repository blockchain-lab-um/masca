import { MinimalUnsignedCredential } from '@blockchain-lab-um/masca-types';

import { readJSON } from '../../helpers/readJSON';

const EXAMPLE_VC_PAYLOAD = readJSON(
  import.meta.url,
  'examplePayload.json'
) as MinimalUnsignedCredential;

export { EXAMPLE_VC_PAYLOAD };
