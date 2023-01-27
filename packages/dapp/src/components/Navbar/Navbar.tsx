import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useGeneralStore } from 'src/utils/store';
import Link from 'next/link';
import ToggleTheme from '../ToggleTheme';
import { NavBtn } from './NavBtn';
import Button from '../Button';
import DropdownMenu from '../MethodDropdownMenu';
import logo_b from '../../images/ssi_icon_b.png';
import logo_w from '../../images/ssi_icon_w.png';
import ConnectButton from '../ConnectButton';

export default function Navbar() {
  const router = useRouter();
  const isConnected = useGeneralStore((state) => state.isConnected);
  const changeIsConnected = useGeneralStore((state) => state.changeIsConnected);
  const hasMM = useGeneralStore((state) => state.hasMetaMask);
  const hasFlask = useGeneralStore((state) => state.isFlask);
  const address = useGeneralStore((state) => state.address);

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
            <h1 className="mx-1 font-ubuntu text-h4 sm:text-h2 lg:text-h1 hover:text-orange dark:text-orange dark:hover:text-white animated-transition">
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
          <NavBtn page="/...">...</NavBtn>
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
                      <Button
                        variant="primary"
                        onClick={() => {
                          changeIsConnected(false);
                        }}
                      >
                        {`${address.slice(0, 6)}...${address.slice(-4)}`}
                      </Button>
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
