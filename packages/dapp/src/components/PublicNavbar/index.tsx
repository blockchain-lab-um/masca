'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { XMarkIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import Button from '@/components//Button';
import HomeLogo from '@/components/HomeLogo';

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
    <div className="mb-8 flex">
      <Link href="/">
        <HomeLogo />
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
            <a className={clsx('nav-btn')} key={name} href={href}>
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
          App
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
          'absolute left-0 top-0 z-50 h-full w-full transition-transform duration-300',
          isMenuOpen ? 'translate-x-0 transform' : '-translate-x-full transform'
        )}
      >
        <div className="flex flex-col space-y-4 p-6">
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
  );
};

export default PublicNavbar;
