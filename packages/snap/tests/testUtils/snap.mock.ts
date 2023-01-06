import { RequestArguments } from '@metamask/providers/dist/BaseProvider';
import { Maybe } from '@metamask/providers/dist/utils';
import { SnapsGlobalObject } from '@metamask/snaps-types';

import { address, mnemonic, privateKey } from './constants';
import { SSISnapState } from '../../src/interfaces';
import { Wallet } from 'ethers';
import { BIP44CoinTypeNode } from '@metamask/key-tree';
interface ISnapMock {
  request<T>(args: RequestArguments): Promise<Maybe<T>>;
  resetHistory(): void;
}
interface SnapManageState {
  operation: 'get' | 'update' | 'clear';
  newState: unknown;
}

export class SnapMock implements ISnapMock {
  private snapState: SSISnapState | null = null;
  private snap: Wallet = new Wallet(privateKey);

  private snapManageState(params: SnapManageState): SSISnapState | null {
    if (!params) {
      return null;
    }
    if (params.operation === 'get') {
      return this.snapState;
    } else if (params.operation === 'update') {
      this.snapState = params.newState as SSISnapState;
    } else if (params.operation === 'clear') {
      this.snapState = null;
    }

    return null;
  }

  private async snapPersonalSign(data: string[]): Promise<string> {
    const signature = await this.snap.signMessage(data[0]);
    return signature;
  }

  readonly rpcMocks = {
    snap_dialog: jest.fn(),
    eth_requestAccounts: jest.fn().mockResolvedValue([address]),
    eth_chainId: jest.fn().mockResolvedValue('0x5'),
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
    snap_manageState: jest
      .fn()
      .mockImplementation((params: unknown) =>
        this.snapManageState(params as SnapManageState)
      ),
    personal_sign: jest.fn().mockImplementation(async (data: unknown) => {
      return await this.snapPersonalSign(data as string[]);
    }),
    eth_signTypedData_v4: jest
      .fn()
      .mockImplementation((...params: unknown[]) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
        const { domain, types, message } = JSON.parse(params[1] as any);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        delete types.EIP712Domain;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return this.snap._signTypedData(domain, types, message);
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
