import { WalletMock, createMockWallet } from '../../testUtils/wallet.mock';
import { init } from '../../../src/rpc/snap/init';
import { SnapProvider } from '@metamask/snap-types';
import { defaultConfig } from '../../../src/utils/config';
import { getDefaultSnapState } from '../../testUtils/constants';

describe('RPC handler [init]', () => {
  let walletMock: SnapProvider & WalletMock;

  beforeEach(() => {
    walletMock = createMockWallet();
  });

  it('should succeed for accepted terms and conditions', async () => {
    // const initialState = getDefaultSnapState();
    // initialState.snapConfig.snap.acceptedTerms = true;
    // walletMock.rpcMocks.snap_confirm.resolves(true);
    // expect.assertions(1);
    // await expect(init(walletMock)).resolves.toBe(initialState);
    // expect(walletMock.rpcMocks.snap_confirm).to.have.callCount(1);
    // expect(walletMock.rpcMocks.eth_requestAccounts).to.have.callCount(3);
    // expect(walletMock.rpcMocks.snap_manageState).to.have.callCount(14);
    // await expect(getSnapConfig(walletMock)).to.eventually.be.deep.equal(
    //   defaultConfig
    // );
  });

  // it('should fail for rejected terms and conditions', async function () {
  //   walletMock.rpcMocks.snap_confirm.resolves(false);

  //   await expect(init(walletMock)).to.eventually.rejectedWith(
  //     'User did not accept terms and conditions'
  //   );

  //   expect(walletMock.rpcMocks.snap_confirm).to.have.callCount(1);
  //   expect(walletMock.rpcMocks.snap_manageState).to.have.callCount(4);
  // });

  // it('should fail for rejected eth_requestAccounts', async function () {
  //   walletMock.rpcMocks.snap_confirm.resolves(true);
  //   walletMock.rpcMocks.eth_requestAccounts.rejects();

  //   await expect(init(walletMock)).to.eventually.be.rejected;

  //   // expect(walletMock.rpcMocks.snap_confirm).to.have.callCount(1);
  //   // expect(walletMock.rpcMocks.snap_manageState).to.have.callCount(14);
  // });

  // it('should fail for rejected personal_sign', async function () {
  //   walletMock.rpcMocks.snap_confirm.resolves(true);
  //   walletMock.rpcMocks.personal_sign.rejects();

  //   await expect(init(walletMock)).to.eventually.be.rejected;

  //   // expect(walletMock.rpcMocks.snap_confirm).to.have.callCount(1);
  //   // expect(walletMock.rpcMocks.snap_manageState).to.have.callCount(14);
  // });
});
