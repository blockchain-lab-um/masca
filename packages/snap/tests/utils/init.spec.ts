import { SnapsGlobalObject } from '@metamask/snaps-types';
import { SnapMock, createMockSnap } from '../testUtils/snap.mock';
import { init } from '../../src/utils/init';
import { getInitialSnapState } from '../../src/utils/config';

describe('RPC handler [init]', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeEach(() => {
    snapMock = createMockSnap();
  });

  it('should succeed for accepted terms and conditions', async () => {
    const initialState = getInitialSnapState();
    snapMock.rpcMocks.snap_dialog.mockReturnValueOnce(true);

    await expect(init(snapMock)).resolves.toEqual(initialState);
    expect(snapMock.rpcMocks.snap_manageState).toHaveBeenCalledWith({
      operation: 'update',
      newState: initialState,
    });

    expect.assertions(2);
  });

  // it('should fail for rejected terms and conditions', async function () {
  //   snapMock.rpcMocks.snap_dialog.mockReturnValueOnce(false);

  //   await expect(init(snapMock)).rejects.toThrow(
  //     new Error('User did not accept terms and conditions!')
  //   );

  //   expect.assertions(1);
  // });
});
