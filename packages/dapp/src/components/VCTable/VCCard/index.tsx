import React from 'react';
import Link from 'next/link';
import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
import { Row } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import Tooltip from '@/components/Tooltip';

interface VCCardProps {
  row: Row<QueryVCsRequestResult>;
}

const VCCard = ({ row }: VCCardProps) => {
  const t = useTranslations('Dashboard');
  const types = row.getValue('type');
  const date = new Date(row.getValue('date')).toDateString();
  const expDate =
    new Date(row.getValue('exp_date')).toDateString() !== 'Invalid Date'
      ? new Date(row.getValue('exp_date')).toDateString()
      : t('card.no-exp-date');
  const issuer: string = row.getValue('issuer');
  const validity = row.getValue('status');
  const issuerLink = (
    <Tooltip tooltip={t('tooltip.open-did')}>
      <a
        href={`https://dev.uniresolver.io/#${issuer}`}
        target="_blank"
        rel="noreferrer"
        className="underline"
      >{`${issuer.slice(0, 8)}....${issuer.slice(-4)}`}</a>
    </Tooltip>
  );
  return (
    <div className="min-h-56 mx-4 mt-8 w-72 shrink-0 grow-0 rounded-xl border border-gray-200 bg-gradient-to-b from-orange-50 to-pink-50 p-4 shadow-lg sm:w-96 ">
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <Link
            href={{
              pathname: '/vc',
              query: { id: row.original.metadata.id },
            }}
          >
            <button className="font-ubuntu text-sm font-bold text-gray-900">
              {t('card.more')}
            </button>
          </Link>

          <div>
            {validity === 'true' ? (
              <span className="rounded-full bg-green-300/80 px-4 py-1 text-green-700">
                valid
              </span>
            ) : (
              <span className="rounded-full bg-red-100 px-3.5 py-1 text-red-900">
                invalid
              </span>
            )}
          </div>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <div className="text-md w-[45%] text-gray-700">
            <div>
              <span className="text-2xs text-gray-500">{t('card.issued')}</span>
              <div className="">{issuerLink}</div>
            </div>
            <div className="mt-1">
              <span className="text-2xs text-gray-500">
                {t('card.issued-date')}
              </span>
              <div>{date}</div>
            </div>
            <div className="mt-1">
              <span className="text-2xs text-gray-500">
                {t('card.expires')}
              </span>
              <div>{expDate}</div>
            </div>
          </div>
          <div className="text-h4 font-ubuntu text-center font-normal text-pink-500">
            {types as string}
          </div>
        </div>
        <button
          onClick={() => {
            row.toggleSelected();
          }}
          className={`${
            row.getIsSelected()
              ? 'bg-pink-200/60 font-semibold text-pink-700'
              : 'dark:text-navy-blue-500'
          } mt-4 rounded-full bg-white py-1 shadow-md`}
        >
          <div className="grid grid-cols-3">
            <span className="col-start-2">
              {!row.getIsSelected() ? t('card.select') : t('card.selected')}
            </span>
            <span className="col-start-3 mr-4 text-right text-lg font-semibold">
              {!row.getIsSelected() ? '+' : '-'}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default VCCard;
