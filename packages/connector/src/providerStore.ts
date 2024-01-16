import { createStore, EIP6963ProviderDetail, Store } from 'mipd';

export class ProviderStore {
  private store: Store;

  private currentProvider: EIP6963ProviderDetail | null = null;

  constructor() {
    this.store = createStore();
    // FIXME: this should have a better way to find the provider
    // see: https://github.com/wevm/mipd/issues/12
    const providers = this.store.getProviders();
    this.currentProvider =
      providers.find(
        (provider) =>
          provider.info.rdns === 'io.metamask' ||
          'io.metamask.mmi' ||
          'io.metamask.flask'
      ) || null;

    this.store.subscribe((providerDetails: any) => {
      switch (providerDetails.info.rdns) {
        case 'io.metamask':
        case 'io.metamask.flask':
        case 'io.metamask.mmi':
          this.currentProvider = providerDetails.provider;
          break;
        default:
          break;
      }
    });
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
