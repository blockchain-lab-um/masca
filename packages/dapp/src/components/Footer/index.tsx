import React from 'react';
import { useRouter } from 'next/router';
import { shallow } from 'zustand/shallow';

import AddressPopover from '@/components/AddressPopover';
import ConnectButton from '@/components/ConnectButton';
import DropdownMenu from '@/components/MethodDropdownMenu';
import ToggleTheme from '@/components/ToggleTheme';
import { useGeneralStore, useSnapStore } from '@/utils/stores';

const Footer = () => {
  const router = useRouter();

  const { isConnected, hasMM, hasFlask, address, changeIsConnected } =
    useGeneralStore(
      (state) => ({
        isConnected: state.isConnected,
        hasMM: state.hasMetaMask,
        hasFlask: state.isFlask,
        address: state.address,
        changeIsConnected: state.changeIsConnected,
      }),
      shallow
    );

  const did = useSnapStore((state) => state.currDID);

  const disconnect = () => {
    changeIsConnected(false);
  };

  return (
    <div
      className={`${
        router.pathname === '/' ? 'hidden' : ''
      } flex justify-between items-center mt-auto px-5 py-2 bg-orange-500/10 md:hidden`}
    >
      {hasFlask && hasMM && (
        <>
          {isConnected ? (
            <span>
              <div className="flex m-auto justify-center items-center">
                <AddressPopover
                  address={address}
                  did={did}
                  disconnect={disconnect}
                />
                <DropdownMenu />
              </div>
            </span>
          ) : (
            <ConnectButton />
          )}
        </>
      )}
      <ToggleTheme />
    </div>
  );
};

export default Footer;
