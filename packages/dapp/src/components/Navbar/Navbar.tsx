import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import ToggleTheme from '../ToggleTheme';
import { NavBtn } from './NavBtn';
import Button from '../Button';
import DropdownMenu from '../DropdownMenu';
import logo from '../../images/ssi_icon_b.png';

export default function Navbar() {
  const router = useRouter();

  return (
    <div className="flex justify-between">
      <button
        onClick={() => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          router.push('/');
        }}
      >
        <div className="flex">
          <Image
            src={logo}
            alt="Masca Logo"
            className="h-[24px] w-[24px] mobile:h-[36px] mobile:w-[36px] tablet:h-[46px] tablet:w-[46px] desktop:h-[48px] desktop:w-[48px] rounded-full object-center"
          />
          <h1 className="mx-1 font-ubuntu text-h4 mobile:text-h2 tablet:text-h1 hover:text-orange dark:text-orange dark:hover:text-white animated-transition">
            Masca
          </h1>
        </div>
      </button>
      {router.pathname !== '/' && (
        <div className="flex my-auto mx-2">
          <NavBtn page="/">Home</NavBtn>
          <NavBtn page="/dashboard">Dashboard</NavBtn>
          <NavBtn page="/settings">Settings</NavBtn>
        </div>
      )}

      <div className="hidden md:block">
        <div className="flex justify-between">
          {router.pathname !== '/' && (
            <div className="flex m-auto">
              <DropdownMenu />
              <Button className="btn-connect" onClick={() => {}}>
                Connect Wallet
              </Button>
            </div>
          )}
          <ToggleTheme />
        </div>
      </div>
    </div>
  );
}
