import React from 'react';
import { useRouter } from 'next/router';
import ToggleTheme from '../ToggleTheme';
import { NavBtn } from './NavBtn';
import Button from '../Button';
import DropdownMenu from '../DropdownMenu';

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
        <h1 className=" font-ubuntu text-h4 mobile:text-h2 tablet:text-h1 hover:text-orange dark:text-orange dark:hover:text-white animated-transition">
          Masca
        </h1>
      </button>
      {router.pathname !== '/' && (
        <div className="flex my-auto mx-2">
          <NavBtn text="Home" page="/" />
          <NavBtn text="Dashboard" page="/dashboard" />
          <NavBtn text="Settings" page="/settings" />
        </div>
      )}

      <div className="hidden mobile:block">
        <div className="flex justify-between">
          {router.pathname !== '/' && (
            <div className="flex m-auto">
              <DropdownMenu />
              <Button
                type="btn-connect"
                text="Connect Wallet"
                onClick={() => {}}
              />
            </div>
          )}
          <ToggleTheme />
        </div>
      </div>
    </div>
  );
}
