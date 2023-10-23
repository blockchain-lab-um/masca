import {
  base64ToBytes,
  byteEncoder,
  CircuitData,
  CircuitId,
  CircuitStorage,
  InMemoryDataSource,
} from '@0xpolygonid/js-sdk';

import AUTH_VERIFICATION_KEY from './circuits/authV2/verification_key.json';
import MTP_VERIFICATION_KEY from './circuits/credentialAtomicQueryMTPV2/verification_key.json';
import SIG_VERIFICATION_KEY from './circuits/credentialAtomicQuerySigV2/verification_key.json';

export interface B64File {
  b64: string;
}

class CircuitStorageService {
  static instance: CircuitStorage;

  static async init() {
    if (!this.instance) {
      this.instance = new CircuitStorage(new InMemoryDataSource<CircuitData>());
    }

    try {
      await this.instance.loadCircuitData(CircuitId.AtomicQuerySigV2);
    } catch {
      const sigWasm = await snap.request({
        method: 'snap_getFile',
        params: {
          path: './src/polygon-id/circuits/credentialAtomicQuerySigV2/circuit.wasm',
        },
      });

      const sigZKey = await snap.request({
        method: 'snap_getFile',
        params: {
          path: './src/polygon-id/circuits/credentialAtomicQuerySigV2/circuit_final.zkey',
        },
      });

      const authWasm = await snap.request({
        method: 'snap_getFile',
        params: {
          path: './src/polygon-id/circuits/authV2/circuit.wasm',
        },
      });

      const authZKey = await snap.request({
        method: 'snap_getFile',
        params: {
          path: './src/polygon-id/circuits/authV2/circuit_final.zkey',
        },
      });

      const mtpWasm = await snap.request({
        method: 'snap_getFile',
        params: {
          path: './src/polygon-id/circuits/credentialAtomicQueryMTPV2/circuit.wasm',
        },
      });

      const mtpZKey = await snap.request({
        method: 'snap_getFile',
        params: {
          path: './src/polygon-id/circuits/credentialAtomicQueryMTPV2/circuit_final.zkey',
        },
      });

      await this.instance.saveCircuitData(CircuitId.AtomicQuerySigV2, {
        circuitId: 'credentialAtomicQuerySigV2',
        wasm: base64ToBytes(sigWasm),
        provingKey: base64ToBytes(sigZKey),
        verificationKey: byteEncoder.encode(
          JSON.stringify(SIG_VERIFICATION_KEY)
        ),
      });

      await this.instance.saveCircuitData(CircuitId.AuthV2, {
        circuitId: 'authV2',
        wasm: base64ToBytes(authWasm),
        provingKey: base64ToBytes(authZKey),
        verificationKey: byteEncoder.encode(
          JSON.stringify(AUTH_VERIFICATION_KEY)
        ),
      });

      await this.instance.saveCircuitData(CircuitId.AtomicQueryMTPV2, {
        circuitId: 'credentialAtomicQueryMTPV2',
        wasm: base64ToBytes(mtpWasm),
        provingKey: base64ToBytes(mtpZKey),
        verificationKey: byteEncoder.encode(
          JSON.stringify(MTP_VERIFICATION_KEY)
        ),
      });
    }
  }

  static get() {
    return this.instance;
  }
}

export default CircuitStorageService;
