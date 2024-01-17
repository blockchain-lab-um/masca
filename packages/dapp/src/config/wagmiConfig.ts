import { createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [mainnet],
  connectors: [injected({ target: 'metaMask' })],
  transports: {
    [mainnet.id]: http(
      'https://mainnet.infura.io/v3/bfadcab88c9e4eeb94fcf9e91f1fb8f3'
    ),
  },
});
