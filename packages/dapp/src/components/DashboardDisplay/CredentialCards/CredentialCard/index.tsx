import type { QueryCredentialsRequestResult } from '@blockchain-lab-um/masca-connector';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { Tooltip } from '@nextui-org/react';
import { encodeBase64url } from '@veramo/utils';
import { cn } from '@/utils/shadcn';
import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { convertTypes } from '@/utils/string';
import { formatDid } from '@/utils/format';

interface CredentialCardProps {
  vc: QueryCredentialsRequestResult;
  selected: boolean;
}

const CredentialCard = ({ vc, selected }: CredentialCardProps) => {
  const t = useTranslations('CredentialCard');
  const types = convertTypes(vc.data.type).split(',')[0];
  const date = DateTime.fromISO(
    new Date(Date.parse(vc.data.issuanceDate)).toISOString()
  ).toFormat('dd LLL yyyy');

  const vcExpDate = vc.data.expirationDate;
  let expDate = t('no-exp-date');
  if (vcExpDate) {
    expDate = new Date(Date.parse(vcExpDate)).toDateString();
  }

  let issuer;
  if (!vc.data.issuer) issuer = '';
  else if (typeof vc.data.issuer === 'string') issuer = vc.data.issuer;
  else issuer = vc.data.issuer.id ? vc.data.issuer.id : '';

  let validity = true;
  if (vc.data.expirationDate) {
    validity = Date.now() < Date.parse(vc.data.expirationDate);
  }

  const issuerLink = (
    <Tooltip
      content={t('tooltip.open-did')}
      className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
    >
      <a
        href={`https://dev.uniresolver.io/#${issuer}`}
        target="_blank"
        rel="noreferrer"
        className="underline"
      >
        {formatDid(issuer)}
      </a>
    </Tooltip>
  );

  return (
    <div
      className={cn(
        'animated-transition mx-4 mt-8 h-52 w-80 shrink-0 grow-0 cursor-pointer rounded-xl bg-gradient-to-b from-orange-500 to-pink-500 px-4 py-4 shadow-md shadow-black/50 duration-75 sm:w-96 sm:hover:scale-105 dark:from-orange-600 dark:to-pink-600',
        selected ? 'outline outline-[0.35rem] outline-blue-500' : ''
      )}
    >
      <div className="h-full">
        <div className="grid h-full grid-cols-3">
          <div className="">
            <div className="col-span-1 flex h-full flex-col justify-center text-white">
              <div>
                <span className="text-2xs text-orange-100 dark:text-pink-100">
                  {t('issued')}
                </span>
                <div className="">{issuerLink}</div>
              </div>
              <div className="mt-1">
                <span className="text-2xs text-orange-100 dark:text-pink-100">
                  {t('issued-date')}
                </span>
                <div>{date}</div>
              </div>
              <div className="mt-1">
                <span className="text-2xs text-orange-100 dark:text-pink-100">
                  {t('expires')}
                </span>
                <div>{expDate}</div>
              </div>
            </div>
          </div>
          <div className="col-span-2 flex flex-col items-end justify-between">
            <div>
              {validity ? (
                <Tooltip
                  content={t('credential-valid')}
                  className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
                >
                  <CheckCircleIcon className="h-8 w-8 text-orange-100" />
                </Tooltip>
              ) : (
                <Tooltip
                  content={t('credential-invalid')}
                  className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
                >
                  <XCircleIcon className="h-8 w-8 text-red-700 dark:text-red-900" />
                </Tooltip>
              )}
            </div>
            <div className="font-cabin text-right text-[1.3rem] text-orange-100">
              {types.includes('Masca Genesis Campaign Credential') &&
              vc.data.credentialSubject.title
                ? vc.data.credentialSubject.title
                : types}
            </div>
            <Link
              onClick={(e) => {
                e.stopPropagation();
              }}
              href={`/app/verifiable-credential/${encodeBase64url(
                vc.metadata.id
              )}`}
            >
              <button
                type="button"
                className="font-ubuntu animated-transition mt-4 text-right text-sm font-medium text-pink-50/80 underline-offset-4 hover:text-pink-700"
              >
                {t('more')}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CredentialCard;
