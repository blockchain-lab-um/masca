'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import MenuPopover from '@/components/MenuPopover';
import ToggleTheme from '@/components/ToggleTheme';
import MascaLogo from '../MascaLogo';
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
    <div className="absolute left-0 right-0 top-0 m-0 flex h-24 w-screen items-center">
      <div className="flex flex-1 items-center px-4 sm:px-12">
        <Link href="/" className="focus-visible:outline-none">
          <div className="flex">
            <MascaLogo />
            <h1 className="font-ubuntu text-h4 sm:text-h2 lg:text-h1 animated-transition dark:text-navy-blue-300 ml-4 hidden text-gray-900 hover:text-pink-400 dark:hover:text-orange-200 md:block">
              Masca
            </h1>
          </div>
        </Link>
        <div className="mx-2 flex flex-1 items-center justify-center">
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
    </div>
  );
}
