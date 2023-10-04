import { readJSON } from '../../helpers/readJSON';

const EXAMPLE_VC = readJSON(import.meta.url, 'exampleJWT.json');
const EXAMPLE_VC2 = readJSON(import.meta.url, 'exampleJWT_2.json');
const EXAMPLE_VC_LDS = readJSON(import.meta.url, 'exampleJSONLD.json');
const EXAMPLE_VC_EIP712 = readJSON(import.meta.url, 'exampleJSONLD.json');

export { EXAMPLE_VC, EXAMPLE_VC2, EXAMPLE_VC_LDS, EXAMPLE_VC_EIP712 };
