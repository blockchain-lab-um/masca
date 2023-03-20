import React from 'react';
import { useRouter } from 'next/router';

import { NavConnection } from '@/components/Navbar/NavConnection';
import ToggleTheme from '@/components/ToggleTheme';

const Footer = () => {
  const router = useRouter();

  return (
    <div
      className={`${
        router.pathname === '/' ? 'hidden' : ''
      } mt-auto flex items-center justify-between bg-orange-500/10 px-5 py-2 md:hidden`}
    >
      <ToggleTheme />
      <NavConnection />
    </div>
  );
};

export default Footer;
