'use client';

import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { ShareIcon } from '@heroicons/react/24/outline';
import { cn } from '@/utils/shadcn';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Fragment } from 'react';
import { useAccount } from 'wagmi';

const IconCreateCredential = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="dark:text-navy-blue-900 h-6 w-6 text-pink-500"
  >
    <title>Create Credential Icon</title>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
    />
  </svg>
);

const IconVerifyData = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="dark:text-navy-blue-900 h-6 w-6 text-pink-500"
  >
    <title>Verify Data Icon</title>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12"
    />
  </svg>
);

const IconCamera = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="dark:text-navy-blue-900 h-6 w-6 text-pink-500"
  >
    <title>Camera Icon</title>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
    />
  </svg>
);

interface LinkProps {
  name: string;
  href: string;
  icon: () => JSX.Element;
  requiresConnection: boolean;
}

const INTERNAL_LINKS: LinkProps[] = [
  {
    name: 'create-credential',
    href: '/app/create-credential',
    icon: IconCreateCredential,
    requiresConnection: true,
  },
  {
    name: 'verify-data',
    href: '/app/verify-data',
    icon: IconVerifyData,
    requiresConnection: true,
  },
  {
    name: 'qr-scanner',
    href: '/app/encrypted-session',
    icon: IconCamera,
    requiresConnection: false,
  },
  {
    name: 'shared-presentations',
    href: '/app/shared-presentations',
    icon: () => (
      <ShareIcon className="dark:text-navy-blue-900 h-6 w-6 text-pink-500" />
    ),
    requiresConnection: true,
  },
];

interface DropDownItemProps {
  SVGIcon: () => JSX.Element;
  name: string;
  description: string;
}

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
  const { isConnected } = useAccount();

  return (
    <Popover className="group relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            className={cn(
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
                  {INTERNAL_LINKS.map((link) => {
                    if (
                      (link.requiresConnection && isConnected) ||
                      !link.requiresConnection
                    ) {
                      return (
                        <Link
                          key={link.name}
                          href={link.href}
                          onClick={() => {
                            close();
                          }}
                          className="dark:hover:bg-navy-blue-500/40 -m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
                        >
                          <DropDownItem
                            SVGIcon={link.icon}
                            name={t(`dropdown.${link.name}`)}
                            description={t(`dropdown.description.${link.name}`)}
                          />
                        </Link>
                      );
                    }
                    return <div className="hidden" key={link.name} />;
                  })}
                </div>
                <div className="dark:bg-navy-blue-500 bg-gray-100 p-4">
                  <a
                    href="https://docs.masca.io/"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      close();
                    }}
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
