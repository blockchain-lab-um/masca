'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccount } from 'wagmi';

import MascaLogo from '@/components/MascaLogo';
import MenuPopover from '@/components/MenuPopover';
import { NavConnection } from './NavConnection';

const MAIN_LINKS = [
  {
    name: 'credentials',
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
  const { isConnected } = useAccount();

  return (
    <div className="z-50 items-center">
      <div className="flex flex-1 items-center">
        <Link href="/" className="focus-visible:outline-none">
          <div className="flex">
            <MascaLogo />
            <h1 className="font-ubuntu text-h4 sm:text-h2 lg:text-h1 animated-transition dark:text-navy-blue-300 ml-4 hidden text-gray-900 hover:text-pink-400 xl:block dark:hover:text-orange-200">
              Masca
            </h1>
          </div>
        </Link>
        <div className="hidden flex-1 items-center justify-center md:flex">
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
            return <div className="hidden" key={href} />;
          })}
          <MenuPopover />
        </div>
        <div className="flex-1 md:flex-none">
          <div className="flex items-center justify-end">
            <NavConnection />
          </div>
        </div>
      </div>
    </div>
  );
}
