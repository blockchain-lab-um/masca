class SnapStorage {
  /**
   * Function to load the state from the MetaMask encrypted storage
   * @returns
   */
  static async load(): Promise<unknown> {
    return snap.request({
      method: 'snap_manageState',
      params: { operation: 'get' },
    });
  }

  /**
   * Function to save the state to the MetaMask encrypted storage
   * @param state
   */
  static async save(state: any): Promise<void> {
    await snap.request({
      method: 'snap_manageState',
      params: {
        operation: 'update',
        newState: state,
      },
    });
  }

  /**
   * Function to clear the state from the MetaMask encrypted storage
   */
  static async clear(): Promise<void> {
    await snap.request({
      method: 'snap_manageState',
      params: { operation: 'clear' },
    });
  }
}

export default SnapStorage;
