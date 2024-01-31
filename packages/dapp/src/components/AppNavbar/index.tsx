'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useAccount } from 'wagmi';

import MascaLogo from '@/components/MascaLogo';
import MenuPopover from '@/components/MenuPopover';
import ToggleTheme from '@/components/ToggleTheme';
import { NavConnection } from './NavConnection';

const MAIN_LINKS = [
  {
    name: 'dashboard',
    href: '/app',
    requiresConnection: false,
  },
  {
    name: 'campaigns',
    href: '/app/campaigns',
    requiresConnection: false,
  },
  {
    name: 'settings',
    href: '/app/settings',
    requiresConnection: true,
  },
];

export default function AppNavbar() {
  const t = useTranslations('AppNavbar');
  const pathname = usePathname() ?? '/';
  const { isConnected, isConnecting } = useAccount();

  return (
    <div className="fixed top-0 z-50 flex items-center w-screen h-24 m-0 main-bg">
      <div className="flex items-center flex-1 px-4 sm:px-12">
        <Link href="/" className="focus-visible:outline-none">
          <div className="flex">
            <MascaLogo />
            <h1 className="hidden ml-4 text-gray-900 font-ubuntu text-h4 sm:text-h2 lg:text-h1 animated-transition dark:text-navy-blue-300 hover:text-pink-400 dark:hover:text-orange-200 xl:block">
              Masca
            </h1>
          </div>
        </Link>
        <div className="items-center justify-center flex-1 hidden mx-2 md:flex">
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
