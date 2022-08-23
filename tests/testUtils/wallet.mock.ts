import { RequestArguments } from '@metamask/providers/dist/BaseProvider';
import { Maybe } from '@metamask/providers/dist/utils';
import sinon from 'sinon';
import { address, signedMsg } from './constants';

interface IWalletMock {
  request<T>(args: RequestArguments): Promise<Maybe<T>>;
}

class WalletMock implements IWalletMock {
  public readonly rpcStubs = {
    snap_confirm: sinon.stub(),
    eth_requestAccounts: sinon.stub().resolves([address]),
    eth_chainId: sinon.stub(),
    snap_manageState: sinon.stub(),
    personal_sign: sinon.stub().resolves(signedMsg),
  };

  request<T>(args: RequestArguments): Promise<Maybe<T>> {
    const { method, params = [] } = args;

    // @ts-expect-error Args params won't cause an issue
    // eslint-disable-next-line
    return this.rpcStubs[method](...params);
  }
}

export default WalletMock;
