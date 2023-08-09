import { useTranslations } from 'next-intl';

import Button from '@/components/Button';
import { useGeneralStore } from '@/stores';

const ConnectButton = () => {
  const t = useTranslations('ConnectButton');
  const { isConnecting, changeIsConnecting } = useGeneralStore((state) => ({
    isConnecting: state.isConnecting,
    changeIsConnecting: state.changeIsConnecting,
  }));

  return (
    <Button
      variant="connect"
      size="md"
      onClick={() => changeIsConnecting(true)}
      loading={isConnecting}
    >
      {t('connect')}
    </Button>
  );
};

export default ConnectButton;
