import {
  IMerkleTreeStorage,
  IdentityMerkleTreeMetaInformation,
  MerkleTreeType,
} from '@0xpolygonid/js-sdk';
import { CURRENT_STATE_VERSION } from '@blockchain-lab-um/masca-types';
import { Blockchain, DidMethod, NetworkId } from '@iden3/js-iden3-core';
import { Merkletree, str2Bytes } from '@iden3/js-merkletree';

import StorageService from '../../storage/Storage.service';
import { SnapTreeStorage } from './SnapTreeStorage';

const mtTypes = [
  MerkleTreeType.Claims,
  MerkleTreeType.Revocations,
  MerkleTreeType.Roots,
];

export class SnapMerkleTreeStorage implements IMerkleTreeStorage {
  static readonly STORAGE_KEY = 'merkleTreeMeta';

  constructor(
    private readonly account: string,
    private readonly method: DidMethod.Iden3 | DidMethod.PolygonId,
    private readonly blockchain: Blockchain.Ethereum | Blockchain.Polygon,
    private readonly networkId: NetworkId.Main | NetworkId.Mumbai,
    private readonly depth: number
  ) {}

  async createIdentityMerkleTrees(
    identifier: string
  ): Promise<IdentityMerkleTreeMetaInformation[]> {
    const data = StorageService.get();

    const createMetaInfo = () => {
      const treesMeta: IdentityMerkleTreeMetaInformation[] = [];
      for (const mType of mtTypes) {
        const treeId = identifier.concat(`+${mType.toString()}`);
        const metaInfo = { treeId, identifier, type: mType };
        treesMeta.push(metaInfo);
      }
      return treesMeta;
    };

    const base =
      data[CURRENT_STATE_VERSION].accountState[this.account].polygon.state[
        this.method
      ][this.blockchain][this.networkId];

    const meta = base[SnapMerkleTreeStorage.STORAGE_KEY];

    const identityMetaInfo = meta.filter((m) => m.identifier === identifier);

    if (identityMetaInfo.length > 0) {
      return identityMetaInfo;
    }

    const treesMeta = createMetaInfo();

    base[SnapMerkleTreeStorage.STORAGE_KEY] = [...meta, ...treesMeta];

    return base[SnapMerkleTreeStorage.STORAGE_KEY];
  }

  async getIdentityMerkleTreesInfo(
    identifier: string
  ): Promise<IdentityMerkleTreeMetaInformation[]> {
    const data = StorageService.get();
    const base =
      data[CURRENT_STATE_VERSION].accountState[this.account].polygon.state[
        this.method
      ][this.blockchain][this.networkId];

    const meta = base[SnapMerkleTreeStorage.STORAGE_KEY];

    return meta.filter((m) => m.identifier === identifier);
  }

  async addToMerkleTree(
    identifier: string,
    mtType: MerkleTreeType,
    hindex: bigint,
    hvalue: bigint
  ): Promise<void> {
    const data = StorageService.get();
    const base =
      data[CURRENT_STATE_VERSION].accountState[this.account].polygon.state[
        this.method
      ][this.blockchain][this.networkId];

    const meta = base[SnapMerkleTreeStorage.STORAGE_KEY];

    const resultMeta = meta.filter(
      (m) => m.identifier === identifier && m.type === mtType
    )[0];

    if (!resultMeta) {
      throw new Error(
        `Merkle tree not found for identifier ${identifier} and type ${mtType}`
      );
    }

    const tree = new Merkletree(
      new SnapTreeStorage(
        this.account,
        this.method,
        this.blockchain,
        this.networkId,
        str2Bytes(resultMeta.treeId)
      ),
      true,
      this.depth
    );

    await tree.add(hindex, hvalue);
  }

  async getMerkleTreeByIdentifierAndType(
    identifier: string,
    mtType: MerkleTreeType
  ): Promise<Merkletree> {
    const data = StorageService.get();
    const base =
      data[CURRENT_STATE_VERSION].accountState[this.account].polygon.state[
        this.method
      ][this.blockchain][this.networkId];

    const meta = base[SnapMerkleTreeStorage.STORAGE_KEY];
    const resultMeta = meta.filter(
      (m) => m.identifier === identifier && m.type === mtType
    )[0];

    if (!resultMeta) {
      throw new Error(
        `Merkle tree not found for identifier ${identifier} and type ${mtType}`
      );
    }

    return new Merkletree(
      new SnapTreeStorage(
        this.account,
        this.method,
        this.blockchain,
        this.networkId,
        str2Bytes(resultMeta.treeId)
      ),
      true,
      this.depth
    );
  }

  async bindMerkleTreeToNewIdentifier(
    oldIdentifier: string,
    newIdentifier: string
  ): Promise<void> {
    const data = StorageService.get();
    const base =
      data[CURRENT_STATE_VERSION].accountState[this.account].polygon.state[
        this.method
      ][this.blockchain][this.networkId];

    const meta = base[SnapMerkleTreeStorage.STORAGE_KEY];

    const treesMeta = meta
      .filter((m) => m.identifier === oldIdentifier)
      .map((m) => ({ ...m, identifier: newIdentifier }));

    if (treesMeta.length === 0) {
      throw new Error(
        `Merkle tree meta not found for identifier ${oldIdentifier}`
      );
    }

    const newMetaInfo = [
      ...meta.filter((m) => m.identifier !== oldIdentifier),
      ...treesMeta,
    ];

    base[SnapMerkleTreeStorage.STORAGE_KEY] = newMetaInfo;
  }
}
