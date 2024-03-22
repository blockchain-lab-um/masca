import type { MascaState } from '@blockchain-lab-um/masca-types';
import { BIP44CoinTypeNode } from '@metamask/key-tree';
import type { RequestArguments } from '@metamask/providers/dist/BaseProvider';
import type { Maybe } from '@metamask/providers/dist/utils';
import type { SnapsProvider } from '@metamask/snaps-sdk';
import { AlchemyProvider, type Filter, type TransactionRequest } from 'ethers';
import { readFile } from 'node:fs/promises';
import { vi } from 'vitest';

import { account, mnemonic } from '../data/constants';

interface ISnapMock {
  request<T>(args: RequestArguments): Promise<Maybe<T>>;
}
interface SnapManageState {
  operation: 'get' | 'update' | 'clear';
  newState: unknown;
}

export class SnapMock implements ISnapMock {
  private snapState: MascaState | null = null;

  private snapManageState(params: SnapManageState): MascaState | null {
    if (!params) {
      return null;
    }
    if (params.operation === 'get') {
      return this.snapState;
    }
    if (params.operation === 'update') {
      this.snapState = params.newState as MascaState;
    } else if (params.operation === 'clear') {
      this.snapState = null;
    }

    return null;
  }

  private snapGetEntropy(params: { version: string; salt: string }): string {
    if (params.salt === undefined)
      return '0x7213a0a3e566ad34b2a282d97046978e3250b79deeed1a728ef3f0a14da9ab68';

    switch (params.salt.toLowerCase()) {
      case '0xb6665128ee91d84590f70c3268765384a9cafbcd':
        return '0x77160f04a3daf2ba6b21991da8c82a075ebbb677863e6e21bc1b2c96848c9649';
      case '0x461e557a07ac110bc947f18b3828e26f013dac39':
        return '0x7ca467fedb2f46903cc9e09273957ec6911ebfc602ed57c94701b6b0e504080a';
      default:
        return '0x0000000000000000000000000000000000000000000000000000000000000000';
    }
  }

  private async snapEthCall(data: any[]): Promise<string> {
    const apiKey = 'onEdpQuHfIjaPMc0c5G0Nf8V_ajHh0We';
    const provider = new AlchemyProvider('mainnet', apiKey);
    return provider.call({
      ...data[0],
      blockTag: data[1],
    } as TransactionRequest);
  }

  private async snapEthLogs(data: any[]): Promise<unknown> {
    const apiKey = 'onEdpQuHfIjaPMc0c5G0Nf8V_ajHh0We';
    const provider = new AlchemyProvider('mainnet', apiKey);
    return provider.getLogs(data[0] as Filter);
  }

  readonly rpcMocks = {
    snap_dialog: vi.fn().mockReturnValue(true),
    eth_requestAccounts: vi.fn().mockResolvedValue([account]),
    eth_chainId: vi.fn().mockResolvedValue('0x1'),
    net_version: vi.fn().mockResolvedValue('1'),
    snap_getBip44Entropy: vi
      .fn()
      .mockImplementation(async (params: { coinType: number }) => {
        const node = await BIP44CoinTypeNode.fromDerivationPath([
          `bip39:${mnemonic}`,
          `bip32:44'`,
          `bip32:${params.coinType}'`,
        ]);

        return node.toJSON();
      }),
    snap_getEntropy: vi
      .fn()
      .mockImplementation((params: { version: string; salt: string }) =>
        this.snapGetEntropy(params)
      ),
    snap_manageState: vi
      .fn()
      .mockImplementation((params: unknown) =>
        this.snapManageState(params as SnapManageState)
      ),
    eth_call: vi
      .fn()
      .mockImplementation(async (data: unknown) =>
        this.snapEthCall(data as any[])
      ),
    eth_getLogs: vi
      .fn()
      .mockImplementation(async (data: unknown) =>
        this.snapEthLogs(data as any[])
      ),
    snap_getFile: vi.fn().mockImplementation(
      async (params: {
        path: string;
        encoding?: 'base64' | 'utf8' | 'hex';
      }) => {
        // Use root of the project as base path
        const projectRoot = import.meta.url.split('/').slice(2, -3).join('/');
        const filePath = `${projectRoot}/${params.path.slice(2)}`;

        const value = await readFile(filePath);

        if (params.encoding === 'hex') {
          return value.toString('hex');
        }

        return value.toString('utf8');
      }
    ),
  };

  request<T>(args: RequestArguments): Promise<Maybe<T>> {
    const { method, params } = args;
    return this.rpcMocks[method](params);
  }
}

export function createMockSnap(): SnapsProvider & SnapMock {
  return new SnapMock() as SnapsProvider & SnapMock;
}
