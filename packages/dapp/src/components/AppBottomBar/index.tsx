'use client';

import { useState } from 'react';
import Link from 'next/link';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useAccount } from 'wagmi';

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
];

const OTHER_LINKS = [
  {
    name: 'settings',
    href: '/app/settings',
    requiresConnection: true,
  },
  {
    name: 'create-credential',
    href: '/app/create-credential',
    requiresConnection: true,
  },
  {
    name: 'verify-data',
    href: '/app/verify-data',
    requiresConnection: true,
  },
  {
    name: 'qr-scanner',
    href: '/app/qr-code-session',
    requiresConnection: false,
  },
];

const AppBottomBar = () => {
  const t = useTranslations('AppBottomBar');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isConnected } = useAccount();

  const toggleMenu = () => {
    setIsMenuOpen((currVal) => !currVal);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-20 flex items-center w-screen border-t-2 dark:border-navy-blue-600/50 dark:bg-navy-blue-800 h-14 border-pink-200/50 bg-pink-50 md:hidden">
        <div className="flex items-center flex-1 p-1 px-4">
          <div className="flex items-center flex-1 space-x-2">
            {MAIN_LINKS.map(({ name, href, requiresConnection }) => {
              if ((requiresConnection && isConnected) || !requiresConnection) {
                return (
                  // Link styled as button for mobile bottom navbar with tailwind
                  <Link
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 text-pink-600 bg-pink-100 rounded-lg animated-transition dark:bg-navy-blue-700 dark:hover:bg-navy-blue-600 hover:bg-pink-50 dark:text-white"
                    key={name}
                    href={href}
                  >
                    {t(name)}
                  </Link>
                );
              }
              return <div className="hidden" key={href}></div>;
            })}
          </div>
          <button
            onClick={toggleMenu}
            className="p-2 text-pink-600 bg-pink-100 rounded-lg animated-transition dark:bg-navy-blue-700 dark:hover:bg-navy-blue-600 hover:bg-pink-50 dark:text-white"
          >
            <EllipsisHorizontalIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div
        className={clsx(
          'fixed bottom-14 left-0 z-10 mb-1 w-screen rounded-lg px-1 transition-transform duration-300 md:hidden',
          isMenuOpen ? 'translate-y-0' : 'translate-y-60'
        )}
      >
        <div className="flex flex-col w-full h-full p-2 space-y-1 border-2 rounded-t-lg dark:border-navy-blue-600/50 dark:bg-navy-blue-800 border-pink-200/50 bg-pink-50">
          {OTHER_LINKS.map(({ name, href, requiresConnection }) => {
            if ((requiresConnection && isConnected) || !requiresConnection) {
              return (
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-pink-600 bg-pink-100 rounded-lg outline-none animated-transition dark:bg-navy-blue-700 dark:hover:bg-navy-blue-600 hover:bg-pink-50 focus:outline-none dark:text-white"
                  key={name}
                  href={href}
                >
                  {t(name)}
                </Link>
              );
            }
            return <div className="hidden" key={href}></div>;
          })}
        </div>
      </div>
    </>
  );
};

export default AppBottomBar;
