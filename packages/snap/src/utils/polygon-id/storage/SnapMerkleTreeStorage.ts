import {
  IdentityMerkleTreeMetaInformation,
  IMerkleTreeStorage,
  MerkleTreeType,
} from '@0xpolygonid/js-sdk';
import { Merkletree, str2Bytes } from '@iden3/js-merkletree';

import { getSnapState, updateSnapState } from '../../stateUtils';
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
    private readonly depth: number
  ) {}

  async createIdentityMerkleTrees(
    identifier: string
  ): Promise<IdentityMerkleTreeMetaInformation[]> {
    const data = await getSnapState(snap);

    const createMetaInfo = () => {
      const treesMeta: IdentityMerkleTreeMetaInformation[] = [];
      for (let index = 0; index < mtTypes.length; index += 1) {
        const mType = mtTypes[index];
        const treeId = identifier.concat(`+${mType.toString()}`);
        const metaInfo = { treeId, identifier, type: mType };
        treesMeta.push(metaInfo);
      }
      return treesMeta;
    };

    const meta =
      data.accountState[this.account].polygonState[
        SnapMerkleTreeStorage.STORAGE_KEY
      ];

    const identityMetaInfo = meta.filter((m) => m.identifier === identifier);

    if (identityMetaInfo.length > 0) {
      return identityMetaInfo;
    }

    const treesMeta = createMetaInfo();

    data.accountState[this.account].polygonState[
      SnapMerkleTreeStorage.STORAGE_KEY
    ] = [...meta, ...treesMeta];

    await updateSnapState(snap, data);
    return data.accountState[this.account].polygonState[
      SnapMerkleTreeStorage.STORAGE_KEY
    ];
  }

  async getIdentityMerkleTreesInfo(
    identifier: string
  ): Promise<IdentityMerkleTreeMetaInformation[]> {
    const data = await getSnapState(snap);
    const meta =
      data.accountState[this.account].polygonState[
        SnapMerkleTreeStorage.STORAGE_KEY
      ];

    return meta.filter((m) => m.identifier === identifier);
  }

  async addToMerkleTree(
    identifier: string,
    mtType: MerkleTreeType,
    hindex: bigint,
    hvalue: bigint
  ): Promise<void> {
    const data = await getSnapState(snap);
    const meta =
      data.accountState[this.account].polygonState[
        SnapMerkleTreeStorage.STORAGE_KEY
      ];

    const resultMeta = meta.filter(
      (m) => m.identifier === identifier && m.type === mtType
    )[0];

    if (!resultMeta) {
      throw new Error(
        `Merkle tree not found for identifier ${identifier} and type ${mtType}`
      );
    }

    const tree = new Merkletree(
      new SnapTreeStorage(this.account, str2Bytes(resultMeta.treeId)),
      true,
      this.depth
    );

    console.log('Adding to tree', hindex, hvalue);
    await tree.add(hindex, hvalue);
  }

  async getMerkleTreeByIdentifierAndType(
    identifier: string,
    mtType: MerkleTreeType
  ): Promise<Merkletree> {
    const data = await getSnapState(snap);
    const meta =
      data.accountState[this.account].polygonState[
        SnapMerkleTreeStorage.STORAGE_KEY
      ];
    console.log('getMerkleTreeByIdentifierAndType', identifier, mtType);
    const resultMeta = meta.filter(
      (m) => m.identifier === identifier && m.type === mtType
    )[0];

    if (!resultMeta) {
      throw new Error(
        `Merkle tree not found for identifier ${identifier} and type ${mtType}`
      );
    }

    return new Merkletree(
      new SnapTreeStorage(this.account, str2Bytes(resultMeta.treeId)),
      true,
      this.depth
    );
  }

  async bindMerkleTreeToNewIdentifier(
    oldIdentifier: string,
    newIdentifier: string
  ): Promise<void> {
    const data = await getSnapState(snap);
    const meta =
      data.accountState[this.account].polygonState[
        SnapMerkleTreeStorage.STORAGE_KEY
      ];

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

    data.accountState[this.account].polygonState[
      SnapMerkleTreeStorage.STORAGE_KEY
    ] = newMetaInfo;

    await updateSnapState(snap, data);
  }

  async getMerkleTreeByTreeIdAndType(
    treeId: string,
    mtType: MerkleTreeType
  ): Promise<Merkletree | null> {
    const data = await getSnapState(snap);
    const meta =
      data.accountState[this.account].polygonState[
        SnapMerkleTreeStorage.STORAGE_KEY
      ];

    console.log('getMerkleTreeByTreeIdAndType', treeId, mtType);

    meta.forEach((m) =>
      console.log('getMerkleTreeByTreeIdAndType', m.treeId, m.type)
    );

    const resultMeta = meta.filter(
      (m) => m.treeId === treeId && m.type === mtType
    )[0];

    if (!resultMeta) {
      return null;
    }

    console.log('getMerkleTreeByTreeIdAndType', resultMeta);

    return new Merkletree(
      new SnapTreeStorage(this.account, str2Bytes(resultMeta.treeId)),
      true,
      this.depth
    );
  }
}
