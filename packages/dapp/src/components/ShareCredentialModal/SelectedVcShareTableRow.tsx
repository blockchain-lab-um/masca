import type {
  Disclosure,
  QueryCredentialsRequestResult,
} from '@blockchain-lab-um/masca-connector';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';
import { Tooltip } from '@nextui-org/react';
import { useTranslations } from 'next-intl';

import { isPolygonVC } from '@/utils/credential';
import { formatDid } from '@/utils/format';

interface SelectedVcShareTableRowProps {
  vc: QueryCredentialsRequestResult;
  selectedSdJwtDisclosures: string[];
  handleDisclosureCheck: (
    vcId: string,
    disclosureKey: string,
    checked: boolean
  ) => void;
}

const SelectedVcShareTableRow = ({
  vc,
  selectedSdJwtDisclosures,
  handleDisclosureCheck,
}: SelectedVcShareTableRowProps) => {
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
        <td className="p-2">{type}</td>
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
            <span className="flex items-center justify-center p-2">
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
        {vc.data.disclosures?.length > 0 && (
          <tr className="flex flex-col items-center justify-center animated-transition dark:text-navy-blue-50 dark:border-navy-blue-tone/30 dark:hover:bg-navy-blue-700/30 duration-75 hover:bg-gray-50">
            <td colSpan={5} className="w-full pb-3">
              <label className="block text-center pt-1 text-sm text-gray-800 dark:text-navy-blue-100">
                Select claims to disclose:
              </label>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {vc.data.disclosures
                  .filter((disclosure: Disclosure) => disclosure.key !== 'id')
                  .map((disclosure: Disclosure) => (
                    <div
                      key={`${vc.metadata.id}.${disclosure.key}`}
                      className="flex items-center p-2 bg-white dark:bg-navy-blue-800 rounded-md shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md hover:bg-gray-50 dark:hover:bg-navy-blue-600"
                      style={{
                        flex: '0 1 calc(33% - 0.5rem)', // Zmanjšan razmik in širina
                        maxWidth: '33%',
                      }}
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
                        className="ml-2 text-gray-800 dark:text-navy-blue-100 truncate"
                        title={disclosure.key}
                      >
                        {disclosure.key}
                      </label>
                    </div>
                  ))}
              </div>
            </td>
          </tr>
        )}
      </tr>
    </>
  );
};

export default SelectedVcShareTableRow;
