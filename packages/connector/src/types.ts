declare global {
  interface Window {
    ethereum: {
      isMetaMask: boolean;
      isUnlocked: Promise<boolean>;
      request: <T>(request: { method: string; params?: unknown }) => Promise<T>;
      on: (eventName: unknown, callback: unknown) => unknown;
    };
  }
}

export {};
