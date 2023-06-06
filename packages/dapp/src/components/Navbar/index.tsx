import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';

import MenuPopover from '@/components/MenuPopover';
import ToggleTheme from '@/components/ToggleTheme';
import { NavBtn } from './NavBtn';
import { NavConnection } from './NavConnection';

export default function Navbar() {
  const t = useTranslations('Navbar');
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <Link href="/">
        <button>
          <div className="flex">
            <div className="relative h-[24px] w-[28px] rounded-full object-center sm:h-[36px] sm:w-[40px] lg:h-[46px] lg:w-[50px] xl:h-[48px] xl:w-[54px]">
              <Image
                className="dark:hidden"
                src={'/images/ssi_icon_b.png'}
                alt="Masca Logo"
                fill={true}
              />
              <Image
                className="hidden dark:block"
                src={'/images/ssi_icon_w.png'}
                alt="Masca Logo"
                fill={true}
              />
            </div>
            <h1 className="font-ubuntu text-h4 sm:text-h2 lg:text-h1 animated-transition dark:text-navy-blue-300 ml-4 text-gray-900 hover:text-pink-400 dark:hover:text-orange-200">
              Masca
            </h1>
          </div>
        </button>
      </Link>
      {router.pathname !== '/' && (
        <div className="mx-2 my-auto flex">
          <NavBtn page="/" pathname={router.pathname}>
            {t('menu.home')}
          </NavBtn>
          <NavBtn page="/dashboard" pathname={router.pathname}>
            {t('menu.dashboard')}
          </NavBtn>
          <NavBtn page="/settings" pathname={router.pathname}>
            {t('menu.settings')}
          </NavBtn>
          <NavBtn page="/get-credential" pathname={router.pathname}>
            Get credential
          </NavBtn>
          <NavBtn page="/authorization-request" pathname={router.pathname}>
            Authorization request
          </NavBtn>
          <MenuPopover />
        </div>
      )}
      <div className="hidden md:block">
        <div className="flex justify-between">
          {router.pathname !== '/' && <NavConnection />}
          <ToggleTheme />
        </div>
      </div>
    </div>
  );
}
