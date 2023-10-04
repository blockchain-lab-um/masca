import { readJSON } from '../../helpers/readJSON';

const EXAMPLE_VC_PAYLOAD = readJSON(import.meta.url, 'examplePayload.json');

export { EXAMPLE_VC_PAYLOAD };
