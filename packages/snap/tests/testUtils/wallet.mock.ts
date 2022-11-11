import { RequestArguments } from '@metamask/providers/dist/BaseProvider';
import { Maybe } from '@metamask/providers/dist/utils';
import { SnapProvider } from '@metamask/snap-types';

import { address, mnemonic, privateKey } from './constants';
import { SSISnapState } from '../../src/interfaces';
import { Wallet } from 'ethers';
import { BIP44CoinTypeNode } from '@metamask/key-tree';
interface IWalletMock {
  request<T>(args: RequestArguments): Promise<Maybe<T>>;
  resetHistory(): void;
}

export class WalletMock implements IWalletMock {
  private snapState: SSISnapState | null = null;
  private wallet: Wallet = new Wallet(privateKey);

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

  private async walletPersonalSign(data: unknown): Promise<string> {
    const acc = new Wallet(privateKey);
    const signature = await acc.signMessage(data as string);
    return signature;
  }

  readonly rpcMocks = {
    snap_confirm: jest.fn(),
    eth_requestAccounts: jest.fn().mockResolvedValue([address]),
    eth_chainId: jest.fn().mockResolvedValue('0x5'),
    snap_getBip44Entropy: jest
      .fn()
      .mockImplementation(async (params: { coinType: number }) => {
        const node = await BIP44CoinTypeNode.fromDerivationPath([
          `bip39:${mnemonic as string}`,
          `bip32:44'`,
          `bip32:${params.coinType}'`,
        ]);

        return node.toJSON();
      }),
    snap_manageState: jest
      .fn()
      .mockImplementation((...params: unknown[]) =>
        this.snapManageState(...params)
      ),
    personal_sign: jest
      .fn()
      .mockImplementation(
        async (data: unknown) => await this.walletPersonalSign(data)
      ),
    eth_signTypedData_v4: jest
      .fn()
      .mockImplementation((...params: unknown[]) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
        const { domain, types, message } = JSON.parse(params[1] as any);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        delete types.EIP712Domain;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return this.wallet._signTypedData(domain, types, message);
      }),
  };

  request<T>(args: RequestArguments): Promise<Maybe<T>> {
    const { method, params = [] } = args;
    if (method === 'snap_getBip44Entropy') {
      // eslint-disable-next-line
      return this.rpcMocks[method](params);
    }

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
