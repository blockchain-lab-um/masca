import { useToastStore } from '@/stores';
import { useTranslations } from 'next-intl';
import { useAccount, useSwitchChain as useSwitchChainWagmi } from 'wagmi';

export const useSwitchChain = () => {
  const t = useTranslations('Hooks');
  const { chainId: currentChainId } = useAccount();
  const { switchChainAsync } = useSwitchChainWagmi();

  const switchChain = async (chainId: number): Promise<boolean> => {
    if (chainId === currentChainId) return true;

    try {
      await switchChainAsync({ chainId });
      return true;
    } catch (error) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: `${t('failed-to-switch-chainId')}: ${chainId}`,
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
