class SnapStorage {
  static async load(): Promise<unknown> {
    return snap.request({
      method: 'snap_manageState',
      params: { operation: 'get' },
    });
  }

  static async save(state: any): Promise<void> {
    await snap.request({
      method: 'snap_manageState',
      params: {
        operation: 'update',
        newState: state,
      },
    });
  }

  static async clear(): Promise<void> {
    await snap.request({
      method: 'snap_manageState',
      params: { operation: 'clear' },
    });
  }
}

export default SnapStorage;
