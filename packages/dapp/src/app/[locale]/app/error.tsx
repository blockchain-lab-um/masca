'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import Button from '@/components/Button';

export default function Page({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('Error');

  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="dark:bg-navy-blue-800 flex flex-1 flex-col items-center justify-center rounded-xl bg-white shadow-lg">
      <h2 className="text-h3 mb-4 text-center">{t('title')}</h2>
      <Button
        variant="primary"
        onClick={
          // Attempt to recover by trying to re-render the route
          () => reset()
        }
      >
        {t('try-again')}
      </Button>
    </main>
  );
}
