import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@nextui-org/react';
import { useTranslations } from 'next-intl';

import { copyToClipboard } from '@/utils/string';

export const DIDDisplay = ({ did }: { did: string }) => {
  const t = useTranslations('DIDDisplay');

  return (
    <>
      <Tooltip
        content={t('tooltip')}
        className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
      >
        <a
          href={`https://dev.uniresolver.io/#${did}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-md animated-transition dark:text-navy-blue-300 cursor-pointer font-normal text-gray-700 underline underline-offset-2"
        >
          {did.length > 20 ? `${did.slice(0, 16)}...${did.slice(-4)}` : did}
        </a>
      </Tooltip>
      <button className="pl-1" onClick={() => copyToClipboard(did)}>
        <DocumentDuplicateIcon className="animated-transition dark:text-navy-blue-300 ml-1 h-5 w-5 text-gray-700 hover:text-gray-700" />
      </button>
    </>
  );
};
