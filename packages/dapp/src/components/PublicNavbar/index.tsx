'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { XMarkIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import Button from '@/components//Button';
import MascaLogo from '@/components/MascaLogo';

const INTERNAL_LINKS = [
  {
    name: 'ecosystem',
    href: '/ecosystem',
  },
];

const EXTERNAL_LINKS = [
  {
    name: 'blog',
    href: 'https://medium.com/@blockchainlabum',
  },
  {
    name: 'discord',
    href: 'https://discord.com/invite/M5xgNz7TTF',
  },
  {
    name: 'twitter',
    href: 'https://twitter.com/masca_io',
  },
  {
    name: 'github',
    href: 'https://github.com/blockchain-lab-um/masca',
  },
];

const PublicNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations('PublicNavbar');

  const router = useRouter();
  const pathname = usePathname() ?? '/';

  return (
    <div className="fixed left-0 right-0 top-0 m-0 flex h-24 w-screen items-center">
      <div className="flex flex-1 items-center px-4 sm:px-12">
        <Link href="/" className="focus-visible:outline-none">
          <div className="flex">
            <MascaLogo />
            <h1 className="font-ubuntu text-h4 sm:text-h2 lg:text-h1 animated-transition dark:text-navy-blue-300 ml-4 text-gray-900 hover:text-pink-400 dark:hover:text-orange-200">
              Masca
            </h1>
          </div>
        </Link>
        <div className="hidden flex-1 items-center justify-end md:flex">
          <div className="mr-4">
            {INTERNAL_LINKS.map(({ name, href }) => (
              <Link
                className={clsx(
                  'nav-btn',
                  pathname === '/ecosystem'
                    ? 'dark:text-orange-accent-dark text-pink-300'
                    : null
                )}
                key={name}
                href={href}
              >
                {t(name)}
              </Link>
            ))}
            {EXTERNAL_LINKS.map(({ name, href }) => (
              <a target='_blank' className={clsx('nav-btn')} key={name} href={href}>
                {t(name)}
              </a>
            ))}
          </div>
          <Button
            variant="white-pink"
            size="md"
            shadow="md"
            onClick={() => router.push('/app')}
          >
            {t('app')}
          </Button>
        </div>
        <div className="flex flex-1 items-center justify-end md:hidden">
          <Button
            variant="white-pink"
            size="md"
            shadow="md"
            onClick={() => setIsMenuOpen(true)}
          >
            {t('menu')}
          </Button>
        </div>
        <div
          className={clsx(
            'main-bg',
            'fixed left-0 top-0 z-50 h-screen w-screen transition-transform duration-300',
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex h-full flex-col space-y-4 p-6">
            <div className="flex justify-end">
              <button
                className={clsx(
                  'animated-transition',
                  'rounded-full border-2 p-1.5 shadow-sm',
                  'hover:dark:text-orange-accent-dark hover:dark:border-orange-accent-dark hover:border-pink-300 hover:text-pink-300'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            {INTERNAL_LINKS.map(({ name, href }) => (
              <Link
                className={clsx(
                  'nav-btn after:duration-500',
                  'py-2',
                  pathname === '/ecosystem'
                    ? 'dark:text-orange-accent-dark text-pink-300'
                    : null
                )}
                key={name}
                href={href}
                onClick={() => setIsMenuOpen(false)}
              >
                {t(name)}
              </Link>
            ))}
            {EXTERNAL_LINKS.map(({ name, href }) => (
              <a
                className={clsx('nav-btn after:duration-500', 'py-2')}
                key={name}
                href={href}
              >
                {t(name)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicNavbar;
