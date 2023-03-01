import React from 'react';
import { useRouter } from 'next/router';

import { useGeneralStore, useSnapStore } from '../../utils/store';
import AddressPopover from '../AddressPopover';
import Button from '../Button';
import ConnectButton from '../ConnectButton';
import DropdownMenu from '../MethodDropdownMenu';
import ToggleTheme from '../ToggleTheme';

export const Footer = () => {
  const router = useRouter();
  const isConnected = useGeneralStore((state) => state.isConnected);
  const changeIsConnected = useGeneralStore((state) => state.changeIsConnected);
  const hasMM = useGeneralStore((state) => state.hasMetaMask);
  const hasFlask = useGeneralStore((state) => state.isFlask);
  const address = useGeneralStore((state) => state.address);
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
