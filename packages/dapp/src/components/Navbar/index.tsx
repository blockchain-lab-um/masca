import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { shallow } from 'zustand/shallow';

import AddressPopover from '@/components/AddressPopover';
import ConnectButton from '@/components/ConnectButton';
import MenuPopover from '@/components/MenuPopover';
import DropdownMenu from '@/components/MethodDropdownMenu';
import ToggleTheme from '@/components/ToggleTheme';
import { BASE_PATH } from '@/utils/constants';
import { useGeneralStore, useSnapStore } from '@/utils/stores';
import { NavBtn } from './NavBtn';

export default function Navbar() {
  const router = useRouter();
  const did = useSnapStore((state) => state.currDID);

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

  const setVcs = useSnapStore((state) => state.changeVcs);

  const disconnect = () => {
    setVcs([]);
    changeIsConnected(false);
  };

  return (
    <div className="flex items-center justify-between">
      <Link href="/">
        <button>
          <div className="flex">
            <div className="relative h-[24px] w-[24px] rounded-full object-center dark:hidden sm:h-[36px] sm:w-[36px] lg:h-[46px] lg:w-[46px] xl:h-[48px] xl:w-[50px]">
              <Image
                src={`${BASE_PATH}/images/ssi_icon_b.png`}
                alt="Masca Logo"
                fill={true}
              />
            </div>
            <div className="relative hidden h-[24px] w-[24px] rounded-full object-center dark:block sm:h-[36px] sm:w-[36px] lg:h-[46px] lg:w-[46px] xl:h-[48px] xl:w-[50px]">
              <Image
                src={`${BASE_PATH}/images/ssi_icon_w.png`}
                alt="Masca Logo"
                fill={true}
              />
            </div>
            <h1 className="font-ubuntu text-h4 sm:text-h2 lg:text-h1 animated-transition mx-1 hover:text-pink-500 dark:text-pink-400 dark:hover:text-orange-50">
              Masca
            </h1>
          </div>
        </button>
      </Link>
      {router.pathname !== '/' && (
        <div className="my-auto mx-2 flex">
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
                    <div className="flex items-center justify-center">
                      <DropdownMenu />
                      <AddressPopover
                        address={address}
                        did={did}
                        disconnect={disconnect}
                      />
                    </div>
                  ) : (
                    <div className="m-auto flex">
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
