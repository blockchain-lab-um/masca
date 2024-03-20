'use client';

import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import { usePathname, useRouter } from 'next/navigation';

export const NormalViewButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <button
      type="button"
      onClick={() => {
        const params = new URLSearchParams(window.location.search);
        params.set('view', 'Normal');
        router.replace(`${pathname}?${params.toString()}`);
      }}
      className="animated-transition dark:text-navy-blue-50 dark:hover:bg-navy-blue-700 rounded-full p-1 mb-4 text-gray-800 hover:bg-pink-100 hover:text-pink-700"
    >
      <ArrowLeftIcon className="h-6 w-6" />
    </button>
  );
};
