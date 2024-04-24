import { formatAddress } from '@/utils/format';
import { copyToClipboard } from '@/utils/string';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@nextui-org/react';
import { useTranslations } from 'next-intl';

export const AddressDisplay = ({ address }: { address: string }) => {
  const t = useTranslations('AddressDisplay');
  return (
    <div className="flex flex-col space-y-0.5">
      <h2 className="dark:text-navy-blue-200 pr-2 font-bold text-gray-800">
        {t('title')}:
      </h2>
      <div className="flex">
        <Tooltip
          className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
          content={t('tooltip')}
        >
          <a
            href={`https://etherscan.io/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-md animated-transition dark:text-navy-blue-300 cursor-pointer font-normal text-gray-700 underline underline-offset-2"
          >
            {formatAddress(address)}
          </a>
        </Tooltip>
        <button
          type="button"
          className="pl-1"
          onClick={() => copyToClipboard(address)}
        >
          <DocumentDuplicateIcon className="animated-transition dark:text-navy-blue-300 ml-1 h-5 w-5 text-gray-700 hover:text-gray-700" />
        </button>
      </div>
    </div>
  );
};
