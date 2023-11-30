'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import MascaLogo from '@/components/MascaLogo';
import MenuPopover from '@/components/MenuPopover';
import ToggleTheme from '@/components/ToggleTheme';
import { useGeneralStore } from '@/stores';
import { NavConnection } from './NavConnection';

const MAIN_LINKS = [
  {
    name: 'dashboard',
    href: '/app',
    requiresConnection: false,
  },
  {
    name: 'settings',
    href: '/app/settings',
    requiresConnection: true,
  },
  {
    name: 'test',
    href: '/app/dashboard',
    requiresConnection: true,
  },
];

export default function AppNavbar() {
  const t = useTranslations('AppNavbar');
  const pathname = usePathname() ?? '/';
  const isConnected = useGeneralStore((state) => state.isConnected);

  return (
    <div className="main-bg fixed left-0 right-0 top-0 z-50 m-0 flex h-24 w-screen items-center">
      <div className="flex flex-1 items-center px-4 sm:px-12">
        <Link href="/" className="focus-visible:outline-none">
          <div className="flex">
            <MascaLogo />
            <h1 className="font-ubuntu text-h4 sm:text-h2 lg:text-h1 animated-transition dark:text-navy-blue-300 ml-4 hidden text-gray-900 hover:text-pink-400 dark:hover:text-orange-200 xl:block">
              Masca
            </h1>
          </div>
        </Link>
        <div className="mx-2 hidden flex-1 items-center justify-center md:flex">
          {MAIN_LINKS.map(({ name, href, requiresConnection }) => {
            if ((requiresConnection && isConnected) || !requiresConnection) {
              return (
                <Link
                  className={clsx(
                    'nav-btn',
                    pathname === href
                      ? 'dark:text-orange-accent-dark text-pink-500'
                      : 'dark:text-navy-blue-400 text-gray-600'
                  )}
                  key={name}
                  href={href}
                >
                  {t(`menu.${name}`)}
                </Link>
              );
            }
            return <div className="hidden" key={href}></div>;
          })}
          <MenuPopover />
        </div>
        <div className="flex-1 md:flex-none">
          <div className="flex items-center justify-end">
            <NavConnection />
            <ToggleTheme />
          </div>
        </div>
      </div>
    </div>
  );
}
