'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  const t = useTranslations('PublicNavbar');

  const router = useRouter();
  const pathname = usePathname() ?? '/';

  return (
    <div className="mb-8 flex ">
      <Link href="/">
        <HomeLogo />
      </Link>
      <div className="flex flex-1 items-center justify-end">
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
    </div>
  );
};

export default PublicNavbar;
