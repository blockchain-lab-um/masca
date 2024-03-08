import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { useMascaStore } from '@/stores';

export const LastFetched = () => {
  const t = useTranslations('LastFetched');
  const lastFetch = useMascaStore((state) => state.lastFetch);
  const [elapsedTime, setElapsedTIme] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTIme(
        lastFetch ? DateTime.fromMillis(lastFetch).toRelative()! : null
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [lastFetch]);

  return (
    <div className="text-h5 dark:text-navy-blue-400 text-gray-600">
      {elapsedTime ? `${t('label')}: ${elapsedTime}` : '-'}
    </div>
  );
};
