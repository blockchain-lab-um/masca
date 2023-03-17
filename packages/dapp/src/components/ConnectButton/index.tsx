import React from 'react';
import { shallow } from 'zustand/shallow';

import Button from '@/components/Button';
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
