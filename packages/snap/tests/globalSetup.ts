import crypto from 'node:crypto';
import {
  base64ToBytes,
  byteEncoder,
  CircuitData,
  CircuitId,
  CircuitStorage,
  InMemoryDataSource,
} from '@0xpolygonid/js-sdk';
import * as matchers from 'jest-extended';
import { beforeAll, expect, vi } from 'vitest';

import { B64File } from '../src/polygon-id/CircuitStorage.service';
import { readJSON } from './helpers/readJSON';

const AUTH_Z_KEY = '../src/polygon-id/circuits/authV2/circuit_final.zkey.json';
const AUTH_WASM = '../src/polygon-id/circuits/authV2/circuit.wasm.json';
const AUTH_VERIFICATION_KEY =
  '../src/polygon-id/circuits/authV2/verification_key.json';
const MTP_Z_KEY =
  '../src/polygon-id/circuits/credentialAtomicQueryMTPV2/circuit_final.zkey.json';
const MTP_WASM =
  '../src/polygon-id/circuits/credentialAtomicQueryMTPV2/circuit.wasm.json';
const MTP_VERIFICATION_KEY =
  '../src/polygon-id/circuits/credentialAtomicQueryMTPV2/verification_key.json';
const SIG_Z_KEY =
  '../src/polygon-id/circuits/credentialAtomicQuerySigV2/circuit_final.zkey.json';
const SIG_WASM =
  '../src/polygon-id/circuits/credentialAtomicQuerySigV2/circuit.wasm.json';
const SIG_VERIFICATION_KEY =
  '../src/polygon-id/circuits/credentialAtomicQuerySigV2/verification_key.json';

expect.extend(matchers);

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.window = { crypto };
});

vi.mock('../src/polygon-id/CircuitStorage.service', () => {
  let instance: CircuitStorage;

  return {
    default: {
      get: vi.fn().mockImplementation(() => instance),
      init: vi.fn().mockImplementation(async () => {
        if (!instance) {
          instance = new CircuitStorage(new InMemoryDataSource<CircuitData>());
        }

        const path = import.meta.url;

        try {
          await instance.loadCircuitData(CircuitId.AtomicQuerySigV2);
        } catch {
          await instance.saveCircuitData(CircuitId.AtomicQuerySigV2, {
            circuitId: 'credentialAtomicQuerySigV2',
            wasm: base64ToBytes((readJSON(path, SIG_WASM) as B64File).b64),
            provingKey: base64ToBytes(
              (readJSON(path, SIG_Z_KEY) as B64File).b64
            ),
            verificationKey: byteEncoder.encode(
              JSON.stringify(readJSON(path, SIG_VERIFICATION_KEY))
            ),
          });
          await instance.saveCircuitData(CircuitId.AuthV2, {
            circuitId: 'authV2',
            wasm: base64ToBytes((readJSON(path, AUTH_WASM) as B64File).b64),
            provingKey: base64ToBytes(
              (readJSON(path, AUTH_Z_KEY) as B64File).b64
            ),
            verificationKey: byteEncoder.encode(
              JSON.stringify(AUTH_VERIFICATION_KEY)
            ),
          });
          await instance.saveCircuitData(CircuitId.AtomicQueryMTPV2, {
            circuitId: 'credentialAtomicQueryMTPV2',
            wasm: base64ToBytes((readJSON(path, MTP_WASM) as B64File).b64),
            provingKey: base64ToBytes(
              (readJSON(path, MTP_Z_KEY) as B64File).b64
            ),
            verificationKey: byteEncoder.encode(
              JSON.stringify(readJSON(path, MTP_VERIFICATION_KEY))
            ),
          });
        }
      }),
    },
  };
});
