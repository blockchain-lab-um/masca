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
    <div className="min-h-56 mx-4 mt-8 w-72 shrink-0 grow-0 rounded-xl bg-gradient-to-b from-pink-500/80 to-orange-500/80 p-4 shadow-lg sm:w-96 ">
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <button
              onClick={() => {
                row.toggleSelected();
              }}
              className={`${
                row.getIsSelected()
                  ? 'bg-pink-100 font-semibold text-pink-500'
                  : 'dark:text-navy-blue-500'
              } mt-4 rounded-full bg-orange-100 py-1 shadow-md`}
            >
              <div className="px-2.5">
                <span className="col-start-2">
                  {!row.getIsSelected() ? t('card.select') : t('card.selected')}
                </span>
                <span className="col-start-3 text-right text-lg font-semibold">
                  {!row.getIsSelected() ? '+' : '-'}
                </span>
              </div>
            </button>
          </div>
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
          <div className="text-md w-[45%] text-white">
            <div>
              <span className="text-2xs text-orange-100">
                {t('card.issued')}
              </span>
              <div className="">{issuerLink}</div>
            </div>
            <div className="mt-1">
              <span className="text-2xs text-orange-100">
                {t('card.issued-date')}
              </span>
              <div>{date}</div>
            </div>
            <div className="mt-1">
              <span className="text-2xs text-orange-100">
                {t('card.expires')}
              </span>
              <div>{expDate}</div>
            </div>
          </div>
          <div className="font-cabin text-center text-2xl font-medium text-orange-100">
            {types as string}
          </div>
        </div>
        <Link
          href={{
            pathname: '/vc',
            query: { id: row.original.metadata.id },
          }}
        >
          <button className="font-ubuntu text-md font-bold text-orange-50 underline-offset-4 hover:underline">
            {t('card.more')} {'>'}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default VCCard;
