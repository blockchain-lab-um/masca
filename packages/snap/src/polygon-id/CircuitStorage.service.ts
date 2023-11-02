import {
  base64ToBytes,
  byteEncoder,
  CircuitData,
  CircuitId,
  CircuitStorage,
  InMemoryDataSource,
} from '@0xpolygonid/js-sdk';

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
          path: './files/circuits/credentialAtomicQuerySigV2/circuit.wasm',
        },
      });

      const sigZKey = await snap.request({
        method: 'snap_getFile',
        params: {
          path: './files/circuits/credentialAtomicQuerySigV2/circuit_final.zkey',
        },
      });

      const sigVerificationKey = await snap.request({
        method: 'snap_getFile',
        params: {
          path: './files/circuits/credentialAtomicQuerySigV2/verification_key.json',
          encoding: 'utf8',
        },
      });

      const authWasm = await snap.request({
        method: 'snap_getFile',
        params: {
          path: './files/circuits/authV2/circuit.wasm',
        },
      });

      const authZKey = await snap.request({
        method: 'snap_getFile',
        params: {
          path: './files/circuits/authV2/circuit_final.zkey',
        },
      });

      const authVerificationKey = await snap.request({
        method: 'snap_getFile',
        params: {
          path: './files/circuits/authV2/verification_key.json',
          encoding: 'utf8',
        },
      });

      const mtpWasm = await snap.request({
        method: 'snap_getFile',
        params: {
          path: './files/circuits/credentialAtomicQueryMTPV2/circuit.wasm',
        },
      });

      const mtpZKey = await snap.request({
        method: 'snap_getFile',
        params: {
          path: './files/circuits/credentialAtomicQueryMTPV2/circuit_final.zkey',
        },
      });

      const mtpVerificationKey = await snap.request({
        method: 'snap_getFile',
        params: {
          path: './files/circuits/credentialAtomicQueryMTPV2/verification_key.json',
          encoding: 'utf8',
        },
      });

      await this.instance.saveCircuitData(CircuitId.AtomicQuerySigV2, {
        circuitId: 'credentialAtomicQuerySigV2',
        wasm: base64ToBytes(sigWasm),
        provingKey: base64ToBytes(sigZKey),
        verificationKey: byteEncoder.encode(sigVerificationKey),
      });

      await this.instance.saveCircuitData(CircuitId.AuthV2, {
        circuitId: 'authV2',
        wasm: base64ToBytes(authWasm),
        provingKey: base64ToBytes(authZKey),
        verificationKey: byteEncoder.encode(
          JSON.stringify(authVerificationKey)
        ),
      });

      await this.instance.saveCircuitData(CircuitId.AtomicQueryMTPV2, {
        circuitId: 'credentialAtomicQueryMTPV2',
        wasm: base64ToBytes(mtpWasm),
        provingKey: base64ToBytes(mtpZKey),
        verificationKey: byteEncoder.encode(JSON.stringify(mtpVerificationKey)),
      });
    }
  }

  static get() {
    return this.instance;
  }
}

export default CircuitStorageService;
