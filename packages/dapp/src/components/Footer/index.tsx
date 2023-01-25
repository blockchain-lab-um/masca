import React from 'react';
import Button from '../Button';
import { useRouter } from 'next/router';
import DropdownMenu from '../DropdownMenu';

export const Footer = () => {
  const router = useRouter();
  return (
    <div
      className={`${
        router.pathname === '/' ? 'hidden' : ''
      } mt-auto px-5 py-2 bg-orange/10 mobile:hidden`}
    >
      <Button
        text="Connect Wallet"
        type="btn-connect text-h4"
        onClick={() => {}}
      />
      <DropdownMenu />
    </div>
  );
};

export default Footer;
