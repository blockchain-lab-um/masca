import {
  base64ToBytes,
  byteEncoder,
  CircuitData,
  CircuitId,
  CircuitStorage,
  InMemoryDataSource,
} from '@0xpolygonid/js-sdk';

import AUTH_Z_KEY from './circuits/authV2/circuit_final.zkey.json';
import AUTH_WASM from './circuits/authV2/circuit.wasm.json';
import AUTH_VERIFICATION_KEY from './circuits/authV2/verification_key.json';
import MTP_Z_KEY from './circuits/credentialAtomicQueryMTPV2/circuit_final.zkey.json';
import MTP_WASM from './circuits/credentialAtomicQueryMTPV2/circuit.wasm.json';
import MTP_VERIFICATION_KEY from './circuits/credentialAtomicQueryMTPV2/verification_key.json';
import SIG_Z_KEY from './circuits/credentialAtomicQuerySigV2/circuit_final.zkey.json';
import SIG_WASM from './circuits/credentialAtomicQuerySigV2/circuit.wasm.json';
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
      await this.instance.saveCircuitData(CircuitId.AtomicQuerySigV2, {
        circuitId: 'credentialAtomicQuerySigV2',
        wasm: base64ToBytes((SIG_WASM as B64File).b64),
        provingKey: base64ToBytes((SIG_Z_KEY as B64File).b64),
        verificationKey: byteEncoder.encode(
          JSON.stringify(SIG_VERIFICATION_KEY)
        ),
      });
      await this.instance.saveCircuitData(CircuitId.AuthV2, {
        circuitId: 'authV2',
        wasm: base64ToBytes((AUTH_WASM as B64File).b64),
        provingKey: base64ToBytes((AUTH_Z_KEY as B64File).b64),
        verificationKey: byteEncoder.encode(
          JSON.stringify(AUTH_VERIFICATION_KEY)
        ),
      });
      await this.instance.saveCircuitData(CircuitId.AtomicQueryMTPV2, {
        circuitId: 'credentialAtomicQueryMTPV2',
        wasm: base64ToBytes((MTP_WASM as B64File).b64),
        provingKey: base64ToBytes((MTP_Z_KEY as B64File).b64),
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
