import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useGeneralStore, useSnapStore } from 'src/utils/store';

import logo_b from '../../images/ssi_icon_b.png';
import logo_w from '../../images/ssi_icon_w.png';
import AddressPopover from '../AddressPopover';
import Button from '../Button';
import ConnectButton from '../ConnectButton';
import MenuPopover from '../MenuPopover';
import DropdownMenu from '../MethodDropdownMenu';
import ToggleTheme from '../ToggleTheme';
import { NavBtn } from './NavBtn';

export default function Navbar() {
  const router = useRouter();
  const isConnected = useGeneralStore((state) => state.isConnected);
  const hasMM = useGeneralStore((state) => state.hasMetaMask);
  const hasFlask = useGeneralStore((state) => state.isFlask);
  const address = useGeneralStore((state) => state.address);
  const did = useSnapStore((state) => state.currDID);
  const changeIsConnected = useGeneralStore((state) => state.changeIsConnected);

  const disconnect = () => {
    changeIsConnected(false);
  };

  return (
    <div className="flex justify-between items-center">
      <Link href="/">
        <button>
          <div className="flex">
            <Image
              src={logo_b}
              alt="Masca Logo"
              className="dark:hidden h-[24px] w-[24px] sm:h-[36px] sm:w-[36px] lg:h-[46px] lg:w-[46px] xl:h-[48px] xl:w-[48px] rounded-full object-center"
            />
            <Image
              src={logo_w}
              alt="Masca Logo"
              className="hidden dark:block h-[24px] w-[24px] sm:h-[36px] sm:w-[36px] lg:h-[46px] lg:w-[46px] xl:h-[48px] xl:w-[48px] rounded-full object-center"
            />
            <h1 className="mx-1 font-ubuntu text-h4 sm:text-h2 lg:text-h1 hover:text-orange-500 dark:text-orange-500 dark:hover:text-white animated-transition">
              Masca
            </h1>
          </div>
        </button>
      </Link>
      {router.pathname !== '/' && (
        <div className="flex my-auto mx-2">
          <NavBtn page="/">Home</NavBtn>
          <NavBtn page="/dashboard">Dashboard</NavBtn>
          <NavBtn page="/settings">Settings</NavBtn>
          <MenuPopover />
        </div>
      )}
      <div className="hidden md:block">
        <div className="flex justify-between">
          {hasMM && hasFlask && (
            <>
              {router.pathname !== '/' && (
                <>
                  {isConnected ? (
                    <div className="flex justify-center items-center">
                      <DropdownMenu />
                      <AddressPopover
                        address={address}
                        did={did}
                        disconnect={disconnect}
                      />
                    </div>
                  ) : (
                    <div className="flex m-auto">
                      <ConnectButton />
                    </div>
                  )}
                </>
              )}
            </>
          )}
          <ToggleTheme />
        </div>
      </div>
    </div>
  );
}
