import { WalletMock, createMockWallet } from '../testUtils/wallet.mock';
import { init } from '../../src/utils/init';
import { SnapProvider } from '@metamask/snap-types';
import { getInitialSnapState } from '../../src/utils/config';

describe('RPC handler [init]', () => {
  let walletMock: SnapProvider & WalletMock;

  beforeEach(() => {
    walletMock = createMockWallet();
  });

  it('should succeed for accepted terms and conditions', async () => {
    const initialState = getInitialSnapState();
    walletMock.rpcMocks.snap_confirm.mockReturnValueOnce(true);

    await expect(init(walletMock)).resolves.toEqual(initialState);
    expect(walletMock.rpcMocks.snap_manageState).toHaveBeenCalledWith(
      'update',
      initialState
    );

    expect.assertions(2);
  });

  it('should fail for rejected terms and conditions', async function () {
    walletMock.rpcMocks.snap_confirm.mockReturnValueOnce(false);

    await expect(init(walletMock)).rejects.toThrow(
      new Error('User did not accept terms and conditions!')
    );

    expect.assertions(1);
  });
});
