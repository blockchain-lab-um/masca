import { RequestArguments } from '@metamask/providers/dist/BaseProvider';
import { Maybe } from '@metamask/providers/dist/utils';
import { SnapProvider } from '@metamask/snap-types';
import sinon from 'sinon';
import { address, signedMsg } from './constants';
import { SSISnapState } from '../../src/interfaces';
interface IWalletMock {
  request<T>(args: RequestArguments): Promise<Maybe<T>>;
  resetHistory(): void;
}

export class WalletMock implements IWalletMock {
  private snapState: SSISnapState | null = null;

  private snapManageState(...params: unknown[]): SSISnapState | null {
    if (params.length === 0) return null;

    if (params[0] === 'get') return this.snapState;
    else if (params[0] === 'update') {
      this.snapState = params[1] as SSISnapState;
    } else if (params[0] === 'clear') {
      this.snapState = null;
    }

    return null;
  }

  readonly rpcMocks = {
    snap_confirm: jest.fn(),
    eth_requestAccounts: jest.fn().mockResolvedValue([address]),
    eth_chainId: jest.fn().mockResolvedValue('0x4'),
    snap_manageState: jest
      .fn()
      .mockImplementation((...params: unknown[]) =>
        this.snapManageState(...params)
      ),
    personal_sign: jest.fn().mockResolvedValue(signedMsg),
  };

  request<T>(args: RequestArguments): Promise<Maybe<T>> {
    const { method, params = [] } = args;

    // @ts-expect-error Args params won't cause an issue
    // eslint-disable-next-line
    return this.rpcMocks[method](...params);
  }

  resetHistory(): void {
    Object.values(this.rpcMocks).forEach((mock) => mock.mockRestore());
  }
}

export function createMockWallet(): SnapProvider & WalletMock {
  return new WalletMock() as SnapProvider & WalletMock;
}
