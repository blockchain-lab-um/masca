import React from 'react';
import { useRouter } from 'next/router';
import Button from '../Button';
import DropdownMenu from '../DropdownMenu';
import ToggleTheme from '../ToggleTheme';

export const Footer = () => {
  const router = useRouter();
  return (
    <div
      className={`${
        router.pathname === '/' ? 'hidden' : ''
      } flex justify-between mt-auto px-5 py-2 bg-orange/10 md:hidden`}
    >
      <span>
        <Button className="btn-connect text-h4" onClick={() => {}}>
          Connect Wallet
        </Button>
        <DropdownMenu />
      </span>
      <ToggleTheme />
    </div>
  );
};

export default Footer;
