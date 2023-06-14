'use client';

import { useState } from 'react';
import Link from 'next/link';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

const MAIN_LINKS = [
  {
    name: 'dashboard',
    href: '/app',
  },
  {
    name: 'settings',
    href: '/app/settings',
  },
];

const OTHER_LINKS = [
  {
    name: 'get-credential',
    href: '/app/get-credential',
  },
  {
    name: 'authorization-request',
    href: '/app/authorization-request',
  },
];

const AppBottomBar = () => {
  const t = useTranslations('AppBottomBar');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((currVal) => !currVal);
  };

  return (
    <>
      <div className="dark:border-navy-blue-600/50 dark:bg-navy-blue-800 fixed bottom-0 left-0 right-0 z-20 flex h-14 w-screen items-center border-t-2 border-pink-200/50 bg-pink-50 md:hidden">
        <div className="flex flex-1 items-center p-1 px-4">
          <div className="flex flex-1 items-center space-x-2">
            {MAIN_LINKS.map(({ name, href }) => (
              // Link styled as button for mobile bottom navbar with tailwind
              <Link
                onClick={() => setIsMenuOpen(false)}
                className="animated-transition dark:bg-navy-blue-700 dark:hover:bg-navy-blue-600 rounded-lg bg-pink-100 p-2 text-pink-600 hover:bg-pink-50 dark:text-white"
                key={name}
                href={href}
              >
                {t(name)}
              </Link>
            ))}
          </div>
          <button
            onClick={toggleMenu}
            className="animated-transition dark:bg-navy-blue-700 dark:hover:bg-navy-blue-600 rounded-lg bg-pink-100 p-2 text-pink-600 hover:bg-pink-50 dark:text-white"
          >
            <EllipsisHorizontalIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
      <div
        className={clsx(
          'fixed bottom-14 left-0 z-10 mb-1 w-screen rounded-lg px-1 transition-transform duration-300 md:hidden',
          isMenuOpen ? 'translate-y-0' : 'translate-y-40'
        )}
      >
        <div className="dark:border-navy-blue-600/50 dark:bg-navy-blue-800 flex h-full w-full flex-col space-y-1 rounded-t-lg border-2 border-pink-200/50 bg-pink-50 p-2">
          {OTHER_LINKS.map(({ name, href }) => (
            <Link
              onClick={() => setIsMenuOpen(false)}
              className="animated-transition dark:bg-navy-blue-700 dark:hover:bg-navy-blue-600 rounded-lg bg-pink-100 p-2 text-pink-600 outline-none hover:bg-pink-50 focus:outline-none dark:text-white"
              key={name}
              href={href}
            >
              {t(name)}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default AppBottomBar;
