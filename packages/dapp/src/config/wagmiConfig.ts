import { createConfig, http } from 'wagmi';
import { goerli, mainnet, polygon, polygonMumbai, sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [mainnet, sepolia, goerli, polygon, polygonMumbai],
  connectors: [injected({ target: 'metaMask' })],
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [goerli.id]: http(),
    [polygon.id]: http(),
    [polygonMumbai.id]: http(),
  },
});
