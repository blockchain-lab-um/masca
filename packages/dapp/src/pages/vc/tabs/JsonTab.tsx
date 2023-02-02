import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
import React from 'react';
import { DocumentDuplicateIcon } from '@heroicons/react/24/solid';

interface JsonTabProps {
  vc: QueryVCsRequestResult;
}

export const JsonTab = ({ vc }: JsonTabProps) => {
  return (
    <div className="flex justify-center py-2">
      <div className="relative h-[50vh] z-0 w-full md:w-3/4">
        <textarea
          className="bg-orange-100 w-full h-full resize-none rounded-2xl focus:outline-none p-2 text-orange-900 font-jetbrains"
          disabled
          value={JSON.stringify(vc, null, 4)}
        />
        <button
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            navigator.clipboard.writeText(JSON.stringify(vc, null, 4));
          }}
          className="absolute bottom-1 right-5 text-orange-900 p-1 rounded-full bg-orange-300 hover:bg-orange-200 hover:text-orange-800 animated-transition"
        >
          <DocumentDuplicateIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
