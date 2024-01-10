'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';

import { copyToClipboard } from '@/utils/string';

interface JsonPanelProps {
  data: Record<string, unknown>;
}

const JsonPanel = ({ data }: JsonPanelProps) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <button
        className="animated-transition dark:text-navy-blue-50 dark:hover:bg-navy-blue-700 mb-6 rounded-full text-gray-800 hover:bg-pink-100 hover:text-pink-700"
        onClick={() => {
          const params = new URLSearchParams(window.location.search);
          params.set('view', 'Normal');
          router.replace(`${pathname}?${params.toString()}`);
        }}
      >
        <ArrowLeftIcon className="h-6 w-6" />
      </button>
      <div className="dark:bg-navy-blue-300 dark:border-navy-blue-400 group relative w-full overflow-hidden rounded-2xl border border-gray-300 bg-gray-200 p-2">
        <textarea
          className="group-hover:scrollbar-thumb-orange-300 dark:text-navy-blue-700 dark:bg-navy-blue-300 scrollbar-thin scrollbar-thumb-orange-300/0 scrollbar-thumb-rounded-full font-jetbrains-mono min-h-[60vh] w-full resize-none rounded-2xl bg-gray-200 p-2 text-gray-800 focus:outline-none"
          disabled
          value={JSON.stringify(data, null, 4)}
        />
        <button
          onClick={() => {
            copyToClipboard(JSON.stringify(data, null, 4));
          }}
          className="animated-transition absolute bottom-3 right-6 rounded-full bg-gray-500 p-1 text-gray-900 shadow-md hover:bg-gray-400 hover:text-gray-700"
        >
          <DocumentDuplicateIcon className="h-5 w-5" />
        </button>
      </div>
    </>
  );
};

export default JsonPanel;
