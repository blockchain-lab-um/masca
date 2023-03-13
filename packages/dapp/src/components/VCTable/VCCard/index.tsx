import React from 'react';
import Link from 'next/link';
import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
import { Row } from '@tanstack/react-table';

import Tooltip from '@/components/Tooltip';

interface VCCardProps {
  row: Row<QueryVCsRequestResult>;
}

const VCCard = ({ row }: VCCardProps) => {
  const types = row.getValue('type');
  const date = new Date(row.getValue('date')).toDateString();
  const expDate =
    new Date(row.getValue('exp_date')).toDateString() !== 'Invalid Date'
      ? new Date(row.getValue('exp_date')).toDateString()
      : 'No expiration date';
  const issuer: string = row.getValue('issuer');
  const validity = row.getValue('status');
  const issuerLink = (
    <Tooltip tooltip={'Open DID in Universal resolver'}>
      <a
        href={`https://dev.uniresolver.io/#${issuer}`}
        target="_blank"
        rel="noreferrer"
        className="underline"
      >{`${issuer.slice(0, 8)}....${issuer.slice(-4)}`}</a>
    </Tooltip>
  );
  return (
    <div className="mx-4 mt-8 h-56 w-72 shrink-0 grow-0 rounded-xl border border-gray-100 bg-gradient-to-b from-orange-50 to-pink-50 p-4 shadow-lg sm:w-96 ">
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <Link
            href={{
              pathname: '/vc',
              query: { id: row.original.metadata.id },
            }}
          >
            <button className="font-ubuntu text-sm">MORE</button>
          </Link>
          <div>{validity === 'true' ? 'valid' : 'invalid'}</div>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <div className="text-md w-[45%] text-gray-900">
            <div>
              <span className="text-2xs text-orange-700">ISSUED BY</span>
              <div className="">{issuerLink}</div>
            </div>
            <div className="mt-1">
              <span className="text-2xs text-orange-700">ISSUED ON</span>
              <div>{date}</div>
            </div>
            <div className="mt-1">
              <span className="text-2xs text-orange-700">EXPIRES ON</span>
              <div>{expDate}</div>
            </div>
          </div>
          <div className="text-h4 text-center font-semibold text-orange-500">
            {types as string}
          </div>
        </div>
        <button
          onClick={() => {
            row.toggleSelected();
          }}
          className={`${
            row.getIsSelected()
              ? 'bg-orange-200 font-semibold text-orange-800'
              : ''
          } mt-4 rounded-full bg-white py-1`}
        >
          <div className="grid grid-cols-3">
            <span className="col-start-2">
              {!row.getIsSelected() ? 'Select' : 'Selected'}
            </span>
            <span className="col-start-3 px-2 text-right font-semibold">
              {!row.getIsSelected() ? '+' : '-'}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default VCCard;
