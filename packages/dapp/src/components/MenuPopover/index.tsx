import { Fragment } from 'react';
import Image from 'next/image';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useTranslations } from 'next-intl';

function IconOne() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="#FFE5E6" />
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
}

function IconTwo() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="#FFE5E6" />
      <path
        d="M28.0413 20L23.9998 13L19.9585 20M32.0828 27.0001L36.1242 34H28.0415M19.9585 34H11.8755L15.9171 27"
        stroke="#FE3D67"
        strokeWidth="2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.804 30H29.1963L24.0001 21L18.804 30Z"
        stroke="#FF8BA7"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconThree() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="13" y="32" width="2" height="4" fill="#FF8BA7" />
      <rect x="17" y="28" width="2" height="8" fill="#FF8BA7" />
      <rect x="21" y="24" width="2" height="12" fill="#FF8BA7" />
      <rect x="25" y="20" width="2" height="16" fill="#FF8BA7" />
      <rect x="29" y="16" width="2" height="20" fill="#FE3D67" />
      <rect x="33" y="12" width="2" height="24" fill="#FE3D67" />
    </svg>
  );
}

const IconDiscord = () => {
  return (
    <div className="relative flex h-12 w-12 items-center justify-center">
      <Image
        src={`/images/discord-mark-blue.png`}
        alt="discord logo"
        width={36}
        height={36}
      />
    </div>
  );
};
const IconGithub = () => {
  return (
    <div className="relative flex h-12 w-12 items-center justify-center">
      <Image
        src={`/images/github-mark.png`}
        alt="discord logo"
        width={36}
        height={36}
      />
    </div>
  );
};
const IconTwitter = () => {
  return (
    <div className="relative flex h-12 w-12 items-center justify-center">
      <Image
        src={`/images/twitter-logo-blue.png`}
        alt="discord logo"
        width={36}
        height={36}
      />
    </div>
  );
};

function MenuPopover() {
  const t = useTranslations('Navbar');

  const solutions = [
    {
      name: t('dropdown.blog'),
      description: t('dropdown.blog-desc'),
      href: 'https://medium.com/@blockchainlabum',
      icon: IconThree,
      target: '_blank',
    },
    {
      name: 'Discord',
      description: t('dropdown.discord-desc'),
      href: 'https://discord.com/invite/M5xgNz7TTF',
      icon: IconDiscord,
      target: '_blank',
    },
    {
      name: 'Twitter',
      description: t('dropdown.twitter-desc'),
      href: 'https://twitter.com/masca_io',
      icon: IconTwitter,
      target: '_blank',
    },
    {
      name: 'Code',
      description: t('dropdown.github-desc'),
      href: 'https://github.com/blockchain-lab-um/masca',
      icon: IconGithub,
      target: '_blank',
    },
  ];
  return (
    <div className="">
      <Popover className="group relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                ${
                  open
                    ? 'dark:text-orange-accent-dark text-pink-300'
                    : 'dark:text-navy-blue-400 text-gray-600'
                }
                nav-btn flex items-end`}
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
                    {solutions.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        target={item.target}
                        rel="noreferrer"
                        className="dark:hover:bg-navy-blue-500 -m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
                          <item.icon aria-hidden="true" />
                        </div>
                        <div className="ml-4">
                          <p className="pb-0.5 text-sm font-medium text-gray-900 dark:text-white">
                            {item.name}{' '}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-300">
                            {item.description}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                  <div className="dark:bg-navy-blue-500 bg-gray-50 p-4">
                    <a
                      href="https://docs.masca.io/"
                      target="_blank"
                      rel="noreferrer"
                      className="dark:hover:bg-navy-blue-700 flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-100  focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                    >
                      <span className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {t('dropdown.documentation')}
                        </span>
                      </span>
                      <span className="block text-sm text-gray-500 dark:text-gray-300">
                        {t('dropdown.learn-more')}
                      </span>
                    </a>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}

export default MenuPopover;
