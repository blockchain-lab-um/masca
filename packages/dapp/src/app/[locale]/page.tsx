'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import Button from '@/components/Button';

export default function Home() {
  const t = useTranslations('Home');

  return (
    <>
      {/* <Head>
        <title>Masca | Home</title>
        <meta
          name="description"
          content="Masca is a decentralized credential management platform"
        />
      </Head> */}
      <div className="mt-[30vh] flex flex-col items-center justify-center text-center">
        <div className="text-h4 sm:text-h2 lg:text-h1 font-ubuntu dark:text-navy-blue-50 text-gray-900">
          {t('title-1')}
          <span className="dark:text-orange-accent-dark pl-1.5 text-pink-500">
            {t('title-2')}
          </span>
        </div>
        <div className="text-h5 dark:text-navy-blue-50 sm:text-h4 lg:text-h3 dark:text-orange-500-60 font-ubuntu pt-8 text-gray-900">
          {t('hero-text-1')}
          <span className=" dark:text-orange-accent-dark px-1.5 text-pink-500">
            {t('SSI')}
          </span>
          {t('hero-text-2')}
        </div>
        <div className="pt-16">
          <Link href="/dashboard">
            <Button variant="white-pink" size="lg" shadow="lg">
              {t('button-1')}
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
