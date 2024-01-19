import { createConfig, http } from 'wagmi';
import { goerli, mainnet, polygon, polygonMumbai, sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [mainnet, sepolia, goerli, polygon, polygonMumbai],
  connectors: [injected({ target: 'metaMask' })],
  ssr: true,
  transports: {
    [mainnet.id]: http(
      process.env.NEXT_PUBLIC_MAINNET_RPC_URL || 'https://mainnet.infura.io/v3/'
    ),
    [sepolia.id]: http(
      process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://rpc.sepolia.io'
    ),
    [goerli.id]: http(
      process.env.NEXT_PUBLIC_GOERLI_RPC_URL || 'https://goerli.infura.io/v3/'
    ),
    [polygon.id]: http(
      process.env.NEXT_PUBLIC_POLYGON_RPC_URL || 'https://polygon-rpc.com/'
    ),
    [polygonMumbai.id]: http(
      process.env.NEXT_PUBLIC_POLYGON_MUMBAI_RPC_URL ||
        'https://rpc-mumbai.maticvigil.com/'
    ),
  },
});
