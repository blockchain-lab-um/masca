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
    >
      <div className="flex">
        Connect Wallet
        {isConnecting && (
          <div className="h-6 w-6 rounded-full object-center">
            <Image
              src={`${BASE_PATH}/images/connect-spinner.png`}
              alt="Masca Logo"
              className="animate-spin"
              width={24}
              height={24}
            />
          </div>
        )}
      </div>
    </Button>
  );
};

export default ConnectButton;
