import {
  Blockchain,
  CURRENT_STATE_VERSION,
  DidMethod,
  NetworkId,
} from '@blockchain-lab-um/masca-types';
import {
  Bytes,
  bytes2Hex,
  Hash,
  ITreeStorage,
  Node,
  NODE_TYPE_EMPTY,
  NODE_TYPE_LEAF,
  NODE_TYPE_MIDDLE,
  NodeEmpty,
  NodeLeaf,
  NodeMiddle,
  ZERO_HASH,
} from '@iden3/js-merkletree';

import StorageService from '../../storage/Storage.service';

export class SnapTreeStorage implements ITreeStorage {
  static readonly STORAGE_KEY = 'merkleTree';

  private currentRoot: Hash;

  private prefixHash: string;

  constructor(
    private readonly account: string,
    private readonly method:
      | typeof DidMethod.Iden3
      | typeof DidMethod.PolygonId,
    private readonly blockchain:
      | typeof Blockchain.Ethereum
      | typeof Blockchain.Polygon,
    private readonly networkId:
      | typeof NetworkId.Main
      | typeof NetworkId.Goerli
      | typeof NetworkId.Mumbai,
    private readonly prefix: Bytes
  ) {
    this.currentRoot = ZERO_HASH;
    this.prefixHash = bytes2Hex(prefix);
  }

  async get(k: Uint8Array): Promise<Node | undefined> {
    const keyBytes = new Uint8Array([...this.prefix, ...k]);
    const key = bytes2Hex(keyBytes);

    const data = StorageService.get();
    const base =
      data[CURRENT_STATE_VERSION].accountState[this.account].polygon.state[
        this.method
      ][this.blockchain][this.networkId];

    const value = base[SnapTreeStorage.STORAGE_KEY][key];

    if (!value) {
      return undefined;
    }

    const node = JSON.parse(value);

    switch (node.type) {
      case NODE_TYPE_EMPTY:
        return new NodeEmpty();
      case NODE_TYPE_MIDDLE: {
        const childL = new Hash(Uint8Array.from(node.childL));
        const childR = new Hash(Uint8Array.from(node.childR));

        return new NodeMiddle(childL, childR);
      }
      case NODE_TYPE_LEAF: {
        const nodeKey = new Hash(Uint8Array.from(node.entry[0]));
        const nodeValue = new Hash(Uint8Array.from(node.entry[1]));

        return new NodeLeaf(nodeKey, nodeValue);
      }
      default:
        throw new Error(
          `error: value found for key ${key} is not of type Node`
        );
    }
  }

  async put(k: Uint8Array, node: Node): Promise<void> {
    const keyBytes = new Uint8Array([...this.prefix, ...k]);
    const key = bytes2Hex(keyBytes);
    const toSerialize: Record<string, unknown> = {
      type: node.type,
    };

    if (node instanceof NodeMiddle) {
      toSerialize.childL = Array.from(node.childL.bytes);
      toSerialize.childR = Array.from(node.childR.bytes);
    } else if (node instanceof NodeLeaf) {
      toSerialize.entry = [
        Array.from(node.entry[0].bytes),
        Array.from(node.entry[1].bytes),
      ];
    }

    const value = JSON.stringify(toSerialize);
    const data = StorageService.get();
    const base =
      data[CURRENT_STATE_VERSION].accountState[this.account].polygon.state[
        this.method
      ][this.blockchain][this.networkId];

    base[SnapTreeStorage.STORAGE_KEY][key] = value;
  }

  async getRoot(): Promise<Hash> {
    if (!this.currentRoot.equals(ZERO_HASH)) {
      return this.currentRoot;
    }

    const data = StorageService.get();
    const base =
      data[CURRENT_STATE_VERSION].accountState[this.account].polygon.state[
        this.method
      ][this.blockchain][this.networkId];
    const rootStr = base[SnapTreeStorage.STORAGE_KEY][this.prefixHash];

    if (!rootStr) {
      this.currentRoot = ZERO_HASH;
    } else {
      const bytes: number[] = JSON.parse(rootStr);
      this.currentRoot = new Hash(Uint8Array.from(bytes));
    }

    return this.currentRoot;
  }

  async setRoot(r: Hash): Promise<void> {
    this.currentRoot = r;

    const data = StorageService.get();
    const base =
      data[CURRENT_STATE_VERSION].accountState[this.account].polygon.state[
        this.method
      ][this.blockchain][this.networkId];

    base[SnapTreeStorage.STORAGE_KEY][bytes2Hex(this.prefix)] = JSON.stringify(
      Array.from(r.bytes)
    );
  }
}
