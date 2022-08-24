import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { WalletMock, createMockWallet } from '../../testUtils/wallet.mock';
import { init } from '../../../src/rpc/snap/init';
import { SnapProvider } from '@metamask/snap-types';
import chaiAsPromised from 'chai-as-promised';
import { getSnapConfig } from '../../../src/utils/stateUtils';
import { defaultConfig } from '../../../src/utils/config';

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.should();

describe('RPC handler [init]', function () {
  let walletMock: SnapProvider & WalletMock;

  beforeEach(function () {
    walletMock = createMockWallet();
  });

  it('should succeed for accepted terms and conditions', async function () {
    walletMock.rpcStubs.snap_confirm.resolves(true);

    await expect(init(walletMock)).to.eventually.be.fulfilled;

    expect(walletMock.rpcStubs.snap_confirm).to.have.callCount(1);
    expect(walletMock.rpcStubs.eth_requestAccounts).to.have.callCount(3);
    expect(walletMock.rpcStubs.snap_manageState).to.have.callCount(14);

    await expect(getSnapConfig(walletMock)).to.eventually.be.deep.equal(
      defaultConfig
    );
  });

  // it('should fail for rejected terms and conditions', async function () {
  //   walletMock.rpcStubs.snap_confirm.resolves(false);

  //   await expect(init(walletMock)).to.eventually.rejectedWith(
  //     'User did not accept terms and conditions'
  //   );

  //   expect(walletMock.rpcStubs.snap_confirm).to.have.callCount(1);
  //   expect(walletMock.rpcStubs.snap_manageState).to.have.callCount(4);
  // });

  // it('should fail for rejected eth_requestAccounts', async function () {
  //   walletMock.rpcStubs.snap_confirm.resolves(true);
  //   walletMock.rpcStubs.eth_requestAccounts.rejects();

  //   await expect(init(walletMock)).to.eventually.be.rejected;

  //   // expect(walletMock.rpcStubs.snap_confirm).to.have.callCount(1);
  //   // expect(walletMock.rpcStubs.snap_manageState).to.have.callCount(14);
  // });

  // it('should fail for rejected personal_sign', async function () {
  //   walletMock.rpcStubs.snap_confirm.resolves(true);
  //   walletMock.rpcStubs.personal_sign.rejects();

  //   await expect(init(walletMock)).to.eventually.be.rejected;

  //   // expect(walletMock.rpcStubs.snap_confirm).to.have.callCount(1);
  //   // expect(walletMock.rpcStubs.snap_manageState).to.have.callCount(14);
  // });
});
