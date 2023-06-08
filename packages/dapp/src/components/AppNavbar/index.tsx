'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import HomeLogo from '@/components/HomeLogo';
import MenuPopover from '@/components/MenuPopover';
import ToggleTheme from '@/components/ToggleTheme';
import { NavConnection } from './NavConnection';

const LINKS = [
  {
    name: 'dashboard',
    href: '/app',
  },
  {
    name: 'settings',
    href: '/app/settings',
  },
  {
    name: 'get-credential',
    href: '/app/get-credential',
  },
  {
    name: 'authorization-request',
    href: '/app/authorization-request',
  },
];

export default function AppNavbar() {
  const t = useTranslations('AppNavbar');
  const pathname = usePathname() ?? '/';

  return (
    <div className="mb-20 flex items-center justify-between">
      <Link href="/" className="focus-visible:outline-none">
        <HomeLogo />
      </Link>
      <div className="mx-2 my-auto flex">
        {LINKS.map(({ name, href }) => (
          <Link
            className={clsx(
              'nav-btn',
              pathname === href
                ? 'dark:text-orange-accent-dark text-pink-300'
                : null
            )}
            key={name}
            href={href}
          >
            {t(`menu.${name}`)}
          </Link>
        ))}
        <MenuPopover />
      </div>
      <div className="hidden md:block">
        <div className="flex justify-between">
          <NavConnection />
          <ToggleTheme />
        </div>
      </div>
    </div>
  );
}
