import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Row } from '@tanstack/react-table';
import Link from 'next/link';
import React from 'react';

interface VCCardProps {
  row: Row<QueryVCsRequestResult>;
}

export const VCCard = ({ row }: VCCardProps) => {
  return (
    <div className=" bg-gradient-to-b from-orange-50 to-pink-50 w-72 sm:w-96  h-52 mx-4 mt-8 p-4 rounded-xl  grow-0 shrink-0 ">
      <div className="flex h-full flex-col justify-between">
        <Link
          href={{
            pathname: '/vc',
            query: { id: row.original.metadata.id },
          }}
        >
          <button>More</button>
        </Link>
        <button
          onClick={() => {
            row.toggleSelected();
          }}
          className={`${
            row.getIsSelected()
              ? 'bg-orange-200 text-orange-800 font-semibold'
              : ''
          } bg-white rounded-full py-1 animated-transition`}
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
