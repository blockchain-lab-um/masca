import React from 'react';
import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
import { DocumentDuplicateIcon } from '@heroicons/react/24/solid';

import { copyToClipboard } from '@/utils/string';

interface JsonTabProps {
  vc: QueryVCsRequestResult;
}

export const JsonTab = ({ vc }: JsonTabProps) => {
  return (
    <div className="p-4 xl:p-12">
      <div className="relative z-0 group bg-orange-100 pt-1 pr-2 rounded-2xl">
        <textarea
          className="group-hover:scrollbar-thumb-orange-300 scrollbar-thin rounded-2xl scrollbar-thumb-orange-300/0 scrollbar-thumb-rounded-full bg-orange-100 min-h-[60vh] w-full resize-none focus:outline-none p-2 text-orange-900 font-jetbrains-mono "
          disabled
          value={JSON.stringify(vc.data, null, 4)}
        />

        <button
          onClick={() => {
            copyToClipboard(JSON.stringify(vc.data, null, 4));
          }}
          className="absolute bottom-3 right-6 text-orange-900 p-1 rounded-full bg-orange-300 hover:bg-orange-200 hover:text-orange-800 shadow-md border border-gray-200 animated-transition"
        >
          <DocumentDuplicateIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
