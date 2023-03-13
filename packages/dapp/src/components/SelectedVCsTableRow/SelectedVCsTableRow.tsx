import React from 'react';
import Link from 'next/link';
import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

import Tooltip from '@/components/Tooltip';

interface SelectedVCsTableRowProps {
  vc: QueryVCsRequestResult;
  handleRemove: (id: string) => void;
}

const SelectedVCsTableRow = ({
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
    <tr className="animated-transition border-b border-gray-500 duration-75 hover:bg-gray-50">
      <td className="py-4">
        <span className="flex items-center justify-center">
          <Link
            href={{
              pathname: '/vc',
              query: { id: vc.metadata.id },
            }}
          >
            <button>
              <ArrowsPointingOutIcon className="h-5 w-5" />
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
              className="text-orange-500 underline hover:text-orange-700"
            >
              {issuer.length > 20
                ? `${issuer.slice(0, 8)}...${issuer.slice(-4)}`
                : issuer}
            </a>
          </Tooltip>
        }
      </td>
      <td>
        <span className="flex items-center justify-center">
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
        <span className="flex items-center justify-center">
          <button onClick={() => handleRemove(vc.metadata.id)}>
            <XCircleIcon className="animated-transition h-6 w-6 rounded-full text-red-500 hover:text-red-500/90" />
          </button>
        </span>
      </td>
    </tr>
  );
};

export default SelectedVCsTableRow;
