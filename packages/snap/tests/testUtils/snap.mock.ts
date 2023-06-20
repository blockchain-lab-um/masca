import type { MascaState } from '@blockchain-lab-um/masca-types';
import { BIP44CoinTypeNode } from '@metamask/key-tree';
import type { RequestArguments } from '@metamask/providers/dist/BaseProvider';
import type { Maybe } from '@metamask/providers/dist/utils';
import type { SnapsGlobalObject } from '@metamask/snaps-types';
import {
  AlchemyProvider,
  Wallet,
  type Filter,
  type TransactionRequest,
} from 'ethers';

import { account, mnemonic, privateKey } from './constants';

interface ISnapMock {
  request<T>(args: RequestArguments): Promise<Maybe<T>>;
  resetHistory(): void;
}
interface SnapManageState {
  operation: 'get' | 'update' | 'clear';
  newState: unknown;
}
export class SnapMock implements ISnapMock {
  private snapState: MascaState | null = null;

  private snap: Wallet = new Wallet(privateKey);

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
    switch (params.salt.toLowerCase()) {
      case '0xb6665128ee91d84590f70c3268765384a9cafbcd':
        return '0x77160f04a3daf2ba6b21991da8c82a075ebbb677863e6e21bc1b2c96848c9649';
      case '0x461e557a07ac110bc947f18b3828e26f013dac39':
        return '0x7ca467fedb2f46903cc9e09273957ec6911ebfc602ed57c94701b6b0e504080a';
      default:
        return '0x0000000000000000000000000000000000000000000000000000000000000000';
    }
  }

  private async snapPersonalSign(data: string[]): Promise<string> {
    const signature = await this.snap.signMessage(data[0]);
    return signature;
  }

  private async snapEthCall(data: any[]): Promise<string> {
    const apiKey = 'NRFBwig_CLVL0WnQLY3dUo8YkPmW-7iN';
    const provider = new AlchemyProvider('goerli', apiKey);
    return provider.call({
      ...data[0],
      blockTag: data[1],
    } as TransactionRequest);
  }

  private async snapEthLogs(data: any[]): Promise<unknown> {
    const apiKey = 'NRFBwig_CLVL0WnQLY3dUo8YkPmW-7iN';
    const provider = new AlchemyProvider('goerli', apiKey);
    return provider.getLogs(data[0] as Filter);
  }

  readonly rpcMocks = {
    snap_dialog: jest.fn().mockReturnValue(true),
    eth_requestAccounts: jest.fn().mockResolvedValue([account]),
    eth_chainId: jest.fn().mockResolvedValue('0x5'),
    net_version: jest.fn().mockResolvedValue('5'),
    snap_getBip44Entropy: jest
      .fn()
      .mockImplementation(async (params: { coinType: number }) => {
        const node = await BIP44CoinTypeNode.fromDerivationPath([
          `bip39:${mnemonic}`,
          `bip32:44'`,
          `bip32:${params.coinType}'`,
        ]);

        return node.toJSON();
      }),
    snap_getEntropy: jest
      .fn()
      .mockImplementation((params: { version: string; salt: string }) =>
        this.snapGetEntropy(params)
      ),
    snap_manageState: jest
      .fn()
      .mockImplementation((params: unknown) =>
        this.snapManageState(params as SnapManageState)
      ),
    personal_sign: jest
      .fn()
      .mockImplementation(async (data: unknown) =>
        this.snapPersonalSign(data as string[])
      ),
    eth_call: jest
      .fn()
      .mockImplementation(async (data: unknown) =>
        this.snapEthCall(data as any[])
      ),
    eth_getLogs: jest
      .fn()
      .mockImplementation(async (data: unknown) =>
        this.snapEthLogs(data as any[])
      ),
    eth_signTypedData_v4: jest
      .fn()
      .mockImplementation((...params: unknown[]) => {
        const { domain, types, message } = JSON.parse(params[1] as string);

        delete types.EIP712Domain;

        return this.snap.signTypedData(domain, types, message);
      }),
  };

  request<T>(args: RequestArguments): Promise<Maybe<T>> {
    const { method, params } = args;
    // @ts-expect-error Args params won't cause an issue
    // eslint-disable-next-line
    return this.rpcMocks[method](params);
  }

  resetHistory(): void {
    Object.values(this.rpcMocks).forEach((mock) => mock.mockRestore());
  }
}

export function createMockSnap(): SnapsGlobalObject & SnapMock {
  return new SnapMock() as SnapsGlobalObject & SnapMock;
}
