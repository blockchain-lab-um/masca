'use client';

import { useTranslations } from 'next-intl';

// TODO: Move this back to page.tsx when we fully convert to server components for translations
const LandingPage = () => {
  const t = useTranslations('Home');

  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="text-center">
        <div className="text-h4 sm:text-h2 lg:text-h1 font-ubuntu dark:text-navy-blue-50 text-gray-900">
          {t('title-1')}
          <span className="dark:text-orange-accent-dark pl-1.5 text-pink-500">
            {t('title-2')}
          </span>
        </div>
        <div className="text-h5 dark:text-navy-blue-50 sm:text-h4 lg:text-h3 dark:text-orange-500-60 font-ubuntu mt-8 text-gray-900">
          {t('hero-text-1')}
          <span className=" dark:text-orange-accent-dark px-1.5 text-pink-500">
            {t('SSI')}
          </span>
          {t('hero-text-2')}
        </div>
        {/* <div className="mt-16 flex justify-center">
          <Link href="/dashboard">
            <Button variant="white-pink" size="lg" shadow="lg">
              {t('button-1')}
            </Button>
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default LandingPage;
