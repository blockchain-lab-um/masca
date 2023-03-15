import React from 'react';
import Image from 'next/image';
import { shallow } from 'zustand/shallow';

import Button from '@/components/Button';
import { BASE_PATH } from '@/utils/constants';
import { useGeneralStore } from '@/utils/stores';

const ConnectButton = () => {
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
      Connect Wallet
    </Button>
  );
};

export default ConnectButton;
