import React from 'react';
import Link from 'next/link';
import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Row } from '@tanstack/react-table';
import clsx from 'clsx';
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
    <div
      onClick={() => {
        row.toggleSelected();
      }}
      className={clsx(
        'animated-transition mx-4 mt-8 h-52 w-80 shrink-0 grow-0 cursor-pointer rounded-xl bg-gradient-to-b from-orange-500 to-pink-500 px-4 py-4 shadow-md shadow-black/50 duration-75 dark:from-orange-600 dark:to-pink-600 sm:w-96 sm:hover:scale-105',
        row.getIsSelected() ? 'outline outline-[0.35rem] outline-blue-500' : ''
      )}
    >
      <div className="h-full">
        <div className="grid h-full grid-cols-3">
          <div className="">
            <div className="col-span-1 flex h-full flex-col justify-center text-white">
              <div>
                <span className="text-2xs text-orange-100 dark:text-pink-100">
                  {t('card.issued')}
                </span>
                <div className="">{issuerLink}</div>
              </div>
              <div className="mt-1">
                <span className="text-2xs text-orange-100 dark:text-pink-100">
                  {t('card.issued-date')}
                </span>
                <div>{date}</div>
              </div>
              <div className="mt-1">
                <span className="text-2xs text-orange-100 dark:text-pink-100">
                  {t('card.expires')}
                </span>
                <div>{expDate}</div>
              </div>
            </div>
          </div>
          <div className="col-span-2 flex flex-col items-end justify-between">
            <div>
              {validity === 'true' ? (
                <Tooltip tooltip="Credential is valid">
                  <CheckCircleIcon className="h-8 w-8 text-orange-100" />
                </Tooltip>
              ) : (
                <Tooltip tooltip="Credential is invalid">
                  <XCircleIcon className="h-8 w-8 text-red-700 dark:text-red-900" />
                </Tooltip>
              )}
            </div>
            <div className="font-cabin text-right text-[1.3rem] text-orange-100">
              {types as string}
            </div>
            <Link
              onClick={(e) => {
                e.stopPropagation();
              }}
              href={{
                pathname: '/vc',
                query: { id: row.original.metadata.id },
              }}
            >
              <button className=" font-ubuntu animated-transition mt-4 text-right text-sm font-medium text-pink-50/80 underline-offset-4 hover:text-pink-700">
                {t('card.more')}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VCCard;
