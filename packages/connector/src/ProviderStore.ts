import { EIP6963ProviderDetail, Store, createStore } from 'mipd';

export class ProviderStore {
  private store: Store;

  private currentProvider: EIP6963ProviderDetail | null = null;

  constructor() {
    this.store = createStore();
    const providers = this.store.getProviders();
    this.currentProvider =
      providers.find((provider) =>
        ['io.metamask', 'io.metamask.mmi', 'io.metamask.flask'].includes(
          provider.info.rdns
        )
      ) || null;
  }

  getCurrentProvider(): EIP6963ProviderDetail | null {
    return this.currentProvider;
  }

  findProvider(rdns: string): EIP6963ProviderDetail | undefined {
    return this.store.findProvider({ rdns });
  }

  destroy(): void {
    this.store.destroy();
  }
}
