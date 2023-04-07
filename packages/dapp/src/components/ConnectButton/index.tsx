import React from 'react';
import { useTranslations } from 'next-intl';
import { shallow } from 'zustand/shallow';

import Button from '@/components/Button';
import { useGeneralStore } from '@/stores';

const ConnectButton = () => {
  const t = useTranslations('Navbar');
  const { isConnecting, changeIsConnecting } = useGeneralStore(
    (state) => ({
      isConnecting: state.isConnecting,
      changeIsConnecting: state.changeIsConnecting,
    }),
    shallow
  );

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
