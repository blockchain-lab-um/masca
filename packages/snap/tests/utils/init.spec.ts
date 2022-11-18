import { snapMock, createMocksnap } from '../testUtils/snap.mock';
import { init } from '../../src/utils/init';
import { SnapsGlobalObject } from '@metamask/snaps-types';
import { getInitialSnapState } from '../../src/utils/config';

describe('RPC handler [init]', () => {
  let snapMock: SnapsGlobalObject & snapMock;

  beforeEach(() => {
    snapMock = createMocksnap();
  });

  it('should succeed for accepted terms and conditions', async () => {
    const initialState = getInitialSnapState();
    snapMock.rpcMocks.snap_confirm.mockReturnValueOnce(true);

    await expect(init(snapMock)).resolves.toEqual(initialState);
    expect(snapMock.rpcMocks.snap_manageState).toHaveBeenCalledWith(
      'update',
      initialState
    );

    expect.assertions(2);
  });

  it('should fail for rejected terms and conditions', async function () {
    snapMock.rpcMocks.snap_confirm.mockReturnValueOnce(false);

    await expect(init(snapMock)).rejects.toThrow(
      new Error('User did not accept terms and conditions!')
    );

    expect.assertions(1);
  });
});
