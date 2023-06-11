'use client';

import { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

const IconEcosystem = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M24 11L35.2583 17.5V30.5L24 37L12.7417 30.5V17.5L24 11Z"
      stroke="#FE3D67"
      strokeWidth="2"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.7417 19.8094V28.1906L24 32.3812L31.2584 28.1906V19.8094L24 15.6188L16.7417 19.8094Z"
      stroke="#FF8BA7"
      strokeWidth="2"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20.7417 22.1196V25.882L24 27.7632L27.2584 25.882V22.1196L24 20.2384L20.7417 22.1196Z"
      stroke="#FF8BA7"
      strokeWidth="2"
    />
  </svg>
);

const IconMedium = () => (
  <div className="relative flex h-12 w-12 items-center justify-center">
    <Image
      src={`/images/medium.png`}
      alt="medium logo"
      width={36}
      height={36}
    />
  </div>
);

const IconDiscord = () => (
  <div className="relative flex h-12 w-12 items-center justify-center">
    <Image
      src={`/images/discord-mark-blue.png`}
      alt="discord logo"
      width={36}
      height={36}
    />
  </div>
);

const IconGithub = () => (
  <div className="relative flex h-12 w-12 items-center justify-center">
    <Image
      src={`/images/github-mark.png`}
      alt="discord logo"
      width={36}
      height={36}
    />
  </div>
);

const IconTwitter = () => (
  <div className="relative flex h-12 w-12 items-center justify-center">
    <Image
      src={`/images/twitter-logo-blue.png`}
      alt="discord logo"
      width={36}
      height={36}
    />
  </div>
);

type LinkProps = {
  name: string;
  href: string;
  icon: () => JSX.Element;
};

const INTERNAL_LINKS: LinkProps[] = [
  {
    name: 'ecosystem',
    href: '/ecosystem',
    icon: IconEcosystem,
  },
];

const EXTERNAL_LINKS: LinkProps[] = [
  {
    name: 'blog',
    href: 'https://medium.com/@blockchainlabum',
    icon: IconMedium,
  },
  {
    name: 'discord',
    href: 'https://discord.com/invite/M5xgNz7TTF',
    icon: IconDiscord,
  },
  {
    name: 'twitter',
    href: 'https://twitter.com/masca_io',
    icon: IconTwitter,
  },
  {
    name: 'github',
    href: 'https://github.com/blockchain-lab-um/masca',
    icon: IconGithub,
  },
];

type DropDownItemProps = {
  SVGIcon: () => JSX.Element;
  name: string;
  description: string;
};

const DropDownItem = ({ SVGIcon, name, description }: DropDownItemProps) => (
  <>
    <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
      <SVGIcon aria-hidden="true" />
    </div>
    <div className="ml-4">
      <p className="pb-0.5 text-sm font-medium text-gray-900 dark:text-white">
        {name}{' '}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-300">{description}</p>
    </div>
  </>
);

function MenuPopover() {
  const t = useTranslations('AppNavbar');

  return (
    <Popover className="group relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={clsx(
              'nav-btn flex items-end',
              open
                ? 'dark:text-orange-accent-dark text-pink-300'
                : 'dark:text-navy-blue-400 text-gray-600'
            )}
          >
            <span>{t('menu.other')}</span>
            <ChevronDownIcon
              className={`animated-transition ml-1 h-5 w-5 ${
                open
                  ? 'dark:text-orange-accent-dark rotate-180 text-pink-300'
                  : 'dark:group-hover:text-orange-accent-dark text-gray-600 group-hover:text-pink-500 '
              }
                  `}
              aria-hidden="true"
            />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute right-0 z-50 mt-3 w-screen max-w-xs">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="dark:bg-navy-blue-400 relative grid gap-8 bg-white p-7 lg:grid-cols-1">
                  {INTERNAL_LINKS.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="dark:hover:bg-navy-blue-500 -m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                    >
                      <DropDownItem
                        SVGIcon={link.icon}
                        name={t(`dropdown.${link.name}`)}
                        description={t(`dropdown.description.${link.name}`)}
                      />
                    </Link>
                  ))}
                  {EXTERNAL_LINKS.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      className="dark:hover:bg-navy-blue-500 -m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                    >
                      <DropDownItem
                        SVGIcon={link.icon}
                        name={t(`dropdown.${link.name}`)}
                        description={t(`dropdown.description.${link.name}`)}
                      />
                    </a>
                  ))}
                </div>
                <div className="dark:bg-navy-blue-500 bg-gray-50 p-4">
                  <a
                    href="https://docs.masca.io/"
                    target="_blank"
                    rel="noreferrer"
                    className="dark:hover:bg-navy-blue-700 flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                  >
                    <span className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {t('dropdown.documentation')}
                      </span>
                    </span>
                    <span className="block text-sm text-gray-500 dark:text-gray-300">
                      {t('dropdown.description.documentation')}
                    </span>
                  </a>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}

export default MenuPopover;
