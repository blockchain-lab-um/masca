import { useToastStore } from '@/stores';
import { useAccount, useSwitchChain as useSwitchChainWagmi } from 'wagmi';

export const useSwitchChain = () => {
  const { chainId: currentChainId } = useAccount();
  const { switchChainAsync } = useSwitchChainWagmi();

  const switchChain = async (chainId: number): Promise<boolean> => {
    if (chainId === currentChainId) true;

    try {
      await switchChainAsync({ chainId });
      return true;
    } catch (error) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: `Failed to switch to chainId: ${chainId}`,
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
      return false;
    }
  };

  return { switchChain };
};
