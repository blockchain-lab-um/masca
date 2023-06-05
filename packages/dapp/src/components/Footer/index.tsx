'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

import { NavConnection } from '@/components/Navbar/NavConnection';
import ToggleTheme from '@/components/ToggleTheme';

const Footer = () => {
  const pathname = usePathname();

  return (
    <div
      className={`${
        pathname === '/' ? 'hidden' : ''
      } mt-auto flex items-center justify-between bg-orange-500/10 px-5 py-2 md:hidden`}
    >
      <ToggleTheme />
      <NavConnection />
    </div>
  );
};

export default Footer;
