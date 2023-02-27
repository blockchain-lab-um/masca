import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Row } from '@tanstack/react-table';
import Link from 'next/link';
import React from 'react';
import Tooltip from 'src/components/Tooltip';
import { convertTypes } from 'src/utils/string';

interface VCCardProps {
  row: Row<QueryVCsRequestResult>;
}

export const VCCard = ({ row }: VCCardProps) => {
  const types = row.getValue('type');
  const date = new Date(row.getValue('date')).toDateString();
  const expDate =
    new Date(row.getValue('exp_date')).toDateString() !== 'Invalid Date'
      ? new Date(row.getValue('exp_date')).toDateString()
      : 'No expiration date';
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const issuer = row.getValue('issuer') as string;
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
    <div className=" bg-gradient-to-b from-orange-50 to-pink-50 w-72 sm:w-96 h-56 mx-4 mt-8 p-4 rounded-xl shadow-lg border-gray-100 border grow-0 shrink-0 ">
      <div className="flex h-full flex-col justify-between">
        <div className="flex justify-between items-center">
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
        <div className="flex justify-between items-center mt-1">
          <div className="text-md text-gray-700">
            <div>
              <span className=" text-2xs text-orange-700">ISSUED BY</span>
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
          <div className="text-h4 text-orange-500 font-semibold">
            {types as string}
          </div>
        </div>
        <button
          onClick={() => {
            row.toggleSelected();
          }}
          className={`${
            row.getIsSelected()
              ? 'bg-orange-200 text-orange-800 font-semibold'
              : ''
          } bg-white rounded-full py-1 mt-4`}
        >
          <div className="grid grid-cols-3">
            <span className="col-start-2">
              {!row.getIsSelected() ? 'Select' : 'Selected'}
            </span>
            <span className="col-start-3 font-semibold text-right px-2">
              {!row.getIsSelected() ? '+' : '-'}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
