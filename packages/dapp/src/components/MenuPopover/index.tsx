'use client';

import { Fragment } from 'react';
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

const IconCreateCredential = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    className="dark:text-navy-blue-900 h-6 w-6 text-pink-500"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
    />
  </svg>
);

const IconVerifyData = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    className="dark:text-navy-blue-900 h-6 w-6 text-pink-500"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12"
    />
  </svg>
);

type LinkProps = {
  name: string;
  href: string;
  icon: () => JSX.Element;
};

const INTERNAL_LINKS: LinkProps[] = [
  {
    name: 'create-credential',
    href: '/app/create-credential',
    icon: IconCreateCredential,
  },
  {
    name: 'verify-data',
    href: '/app/verify-data',
    icon: IconVerifyData,
  },
];

const INTERNAL_EXTRA_LINKS: LinkProps[] = [
  // {
  //   name: 'get-credential',
  //   href: '/app/get-credential',
  //   icon: IconEcosystem,
  // },
  // {
  //   name: 'authorization-request',
  //   href: '/app/authorization-request',
  //   icon: IconEcosystem,
  // },
  {
    name: 'qr-code-session',
    href: '/app/qr-code-session',
    icon: IconEcosystem,
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
      <p className="dark:text-navy-blue-900 pb-0.5 text-sm font-semibold text-gray-900">
        {name}{' '}
      </p>
      <p className="dark:text-navy-blue-700 text-sm text-gray-500">
        {description}
      </p>
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
                ? 'dark:text-orange-accent-dark text-pink-500'
                : 'dark:text-navy-blue-400 text-gray-600'
            )}
          >
            <span>{t('menu.other')}</span>
            <ChevronDownIcon
              className={`animated-transition ml-1 h-5 w-5 ${
                open
                  ? 'dark:text-orange-accent-dark dark:group-hover:text-orange-accent-dark rotate-180 text-pink-500 group-hover:text-pink-500'
                  : 'dark:group-hover:text-orange-accent-dark dark:text-navy-blue-400 text-gray-600 group-hover:text-pink-500 '
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
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                <div className="dark:bg-navy-blue-400 relative grid gap-8 bg-white p-7 lg:grid-cols-1">
                  {INTERNAL_LINKS.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="dark:hover:bg-navy-blue-500/40 -m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
                    >
                      <DropDownItem
                        SVGIcon={link.icon}
                        name={t(`dropdown.${link.name}`)}
                        description={t(`dropdown.description.${link.name}`)}
                      />
                    </Link>
                  ))}
                  {INTERNAL_EXTRA_LINKS.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="dark:hover:bg-navy-blue-500/40 -m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50 xl:hidden"
                    >
                      <DropDownItem
                        SVGIcon={link.icon}
                        name={t(`dropdown.${link.name}`)}
                        description={t(`dropdown.description.${link.name}`)}
                      />
                    </Link>
                  ))}
                </div>
                <div className="dark:bg-navy-blue-500 bg-gray-100 p-4">
                  <a
                    href="https://docs.masca.io/"
                    target="_blank"
                    rel="noreferrer"
                    className="dark:hover:bg-navy-blue-700 flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
                  >
                    <span className="flex items-center">
                      <span className="dark:text-navy-blue-100 text-sm font-semibold text-gray-900">
                        {t('dropdown.documentation')}
                      </span>
                    </span>
                    <span className="dark:text-navy-blue-300 block text-sm text-gray-500">
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
