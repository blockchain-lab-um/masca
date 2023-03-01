import React from 'react';
import Link from 'next/link';
import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import Tooltip from 'src/components/Tooltip';

interface SelectedVCsTableRowProps {
  vc: QueryVCsRequestResult;
  handleRemove: (id: string) => void;
}

export const SelectedVCsTableRow = ({
  vc,
  handleRemove,
}: SelectedVCsTableRowProps) => {
  let issuer = '';
  if (typeof vc.data.issuer === 'string') {
    issuer = vc.data.issuer;
  } else {
    issuer = vc.data.issuer.id;
  }

  let type = '';
  if (vc.data.type) {
    if (typeof vc.data.type === 'string') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      type = vc.data.type;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (Array.isArray(vc.data.type) && vc.data.type.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      type = vc.data.type[vc.data.type.length - 1];
    }
  }

  let validity = true;
  if (vc.data.expirationDate)
    validity = Date.now() < Date.parse(vc.data.expirationDate);

  return (
    <tr className="border-b border-gray-500 hover:bg-gray-50 animated-transition duration-75">
      <td className="py-4">
        <span className="flex justify-center items-center">
          <Link
            href={{
              pathname: '/vc',
              query: { id: vc.metadata.id },
            }}
          >
            <button>
              <ArrowsPointingOutIcon className="w-5 h-5" />
            </button>
          </Link>
        </span>
      </td>
      <td>{type}</td>
      <td>
        {
          <Tooltip tooltip="Open in Universal Resolver">
            <a
              href={`https://dev.uniresolver.io/#${issuer}`}
              target="_blank"
              rel="noreferrer"
              className="text-orange-500 hover:text-orange-700 underline"
            >
              {issuer.length > 20
                ? `${issuer.slice(0, 8)}...${issuer.slice(-4)}`
                : issuer}
            </a>
          </Tooltip>
        }
      </td>
      <td>
        <span className="flex justify-center items-center">
          <Tooltip
            tooltip={`${
              vc.data.expirationDate === undefined
                ? 'Does not have expiration date'
                : `${validity === true ? 'Expires' : 'Expired'} on ${new Date(
                    vc.data.expirationDate
                  ).toDateString()}`
            }`}
          >
            {validity === true ? (
              <CheckCircleIcon className="h-4 w-4 text-green-500" />
            ) : (
              <XCircleIcon className="h-4 w-4 text-red-500" />
            )}
          </Tooltip>
        </span>
      </td>
      <td>
        <span className="flex justify-center items-center">
          <button onClick={() => handleRemove(vc.metadata.id)}>
            <XCircleIcon className="h-6 w-6 text-red-500 hover:text-red-500/90 rounded-full animated-transition" />
          </button>
        </span>
      </td>
    </tr>
  );
};
