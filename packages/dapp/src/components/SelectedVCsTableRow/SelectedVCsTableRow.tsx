import type {
  Disclosure,
  QueryCredentialsRequestResult,
} from '@blockchain-lab-um/masca-connector';
import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';
import { Tooltip } from '@nextui-org/react';
import { encodeBase64url } from '@veramo/utils';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { isPolygonVC } from '@/utils/credential';
import { formatDid } from '@/utils/format';

interface SelectedVCsTableRowProps {
  vc: QueryCredentialsRequestResult;
  selectedSdJwtDisclosures: string[];
  handleRemove: (id: string) => void;
  handleDisclosureCheck: (
    vcId: string,
    disclosureKey: string,
    checked: boolean
  ) => void;
}

const SelectedVCsTableRow = ({
  vc,
  selectedSdJwtDisclosures,
  handleRemove,
  handleDisclosureCheck,
}: SelectedVCsTableRowProps) => {
  const t = useTranslations('SelectedVCsTableRow');

  let issuer = '';
  if (typeof vc.data.issuer === 'string') {
    issuer = vc.data.issuer;
  } else {
    issuer = vc.data.issuer.id;
  }

  let type = '';
  if (vc.data.type) {
    if (typeof vc.data.type === 'string') {
      type = vc.data.type;
    }
    if (Array.isArray(vc.data.type) && vc.data.type.length > 0) {
      type = vc.data.type[vc.data.type.length - 1];
    }
  }

  let validity = true;
  if (vc.data.expirationDate)
    validity = Date.now() < Date.parse(vc.data.expirationDate);

  return (
    <>
      <tr className="animated-transition dark:text-navy-blue-50 dark:border-navy-blue-tone/30 dark:hover:bg-navy-blue-700/30 border-b border-gray-100 duration-75 hover:bg-gray-50">
        <td className="py-2">
          <span className="flex items-center justify-center">
            <Link
              href={`/app/verifiable-credential/${encodeBase64url(
                vc.metadata.id
              )}`}
            >
              <button type="button">
                <ArrowsPointingOutIcon className="h-5 w-5" />
              </button>
            </Link>
          </span>
        </td>
        <td>{type}</td>
        <td>
          {
            <Tooltip
              content={t('open-did')}
              className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
            >
              <a
                href={`https://dev.uniresolver.io/#${issuer}`}
                target="_blank"
                rel="noreferrer"
                className="dark:text-orange-accent-dark dark:hover:text-orange-accent text-pink-500 underline hover:text-pink-400"
              >
                {formatDid(issuer)}
              </a>
            </Tooltip>
          }
        </td>
        <td>
          {!isPolygonVC(vc) ? (
            <span className="flex items-center justify-center">
              <Tooltip
                className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
                content={`${
                  vc.data.expirationDate === undefined
                    ? t('no-expiration-date')
                    : `${
                        validity === true ? t('expires-on') : t('expired-on')
                      } ${new Date(vc.data.expirationDate).toDateString()}`
                }`}
              >
                {validity === true ? (
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircleIcon className="h-4 w-4 text-red-500" />
                )}
              </Tooltip>
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Tooltip
                className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
                content={t('polygon-unsupported')}
              >
                <ExclamationCircleIcon className="h-6 w-6 text-red-500" />
              </Tooltip>
            </span>
          )}
        </td>
        <td>
          <span className="flex items-center justify-center">
            <button type="button" onClick={() => handleRemove(vc.metadata.id)}>
              <XCircleIcon className="animated-transition h-6 w-6 rounded-full text-red-500 hover:text-red-500/90" />
            </button>
          </span>
        </td>
      </tr>
      {vc.data.disclosures?.length > 0 && (
        <tr className="animated-transition dark:text-navy-blue-50 dark:border-navy-blue-tone/30 dark:hover:bg-navy-blue-700/30 duration-75 hover:bg-gray-50">
          <td colSpan={5} className="pb-4 pl-4 pr-4 ">
            <label className="block p-2 text-sm font-medium text-gray-700 dark:text-navy-blue-100">
              Select claims to disclose:
            </label>
            <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {vc.data.disclosures
                .filter((disclosure: Disclosure) => disclosure.key !== 'id')
                .map((disclosure: Disclosure) => (
                  <div
                    key={`${vc.metadata.id}.${disclosure.key}`}
                    className="flex items-center p-2 bg-white dark:bg-navy-blue-800 rounded-lg shadow-md cursor-pointer"
                    onClick={() =>
                      handleDisclosureCheck(
                        vc.metadata.id,
                        disclosure.key,
                        !selectedSdJwtDisclosures.includes(
                          `${vc.metadata.id}/${disclosure.key}`
                        )
                      )
                    }
                  >
                    <input
                      type="checkbox"
                      id={`${vc.metadata.id}.${disclosure.key}`}
                      name={`${vc.metadata.id}.${disclosure.key}`}
                      checked={selectedSdJwtDisclosures.includes(
                        `${vc.metadata.id}/${disclosure.key}`
                      )}
                      onChange={(e) =>
                        handleDisclosureCheck(
                          vc.metadata.id,
                          disclosure.key,
                          e.target.checked
                        )
                      }
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <label
                      htmlFor={`${vc.metadata.id}/${disclosure.key}`}
                      className="ml-2 text-gray-800 dark:text-navy-blue-100"
                    >
                      {disclosure.key}
                    </label>
                  </div>
                ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default SelectedVCsTableRow;
