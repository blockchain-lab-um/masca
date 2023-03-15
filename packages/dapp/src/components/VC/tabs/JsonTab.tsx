import React from 'react';
import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
import { DocumentDuplicateIcon } from '@heroicons/react/24/solid';

import { copyToClipboard } from '@/utils/string';

interface JsonTabProps {
  vc: QueryVCsRequestResult;
}

const JsonTab = ({ vc }: JsonTabProps) => {
  return (
    <div className="p-4 xl:p-12">
      <div className="group relative z-0 rounded-2xl border border-gray-300 bg-gray-200 pt-1 pr-2">
        <textarea
          className="group-hover:scrollbar-thumb-orange-300 scrollbar-thin scrollbar-thumb-orange-300/0 scrollbar-thumb-rounded-full font-jetbrains-mono min-h-[60vh] w-full resize-none rounded-2xl bg-gray-200 p-2 text-gray-800 focus:outline-none"
          disabled
          value={JSON.stringify(vc.data, null, 4)}
        />

        <button
          onClick={() => {
            copyToClipboard(JSON.stringify(vc.data, null, 4));
          }}
          className="animated-transition absolute bottom-3 right-6 rounded-full border border-gray-200 bg-gray-500 p-1 text-gray-900 shadow-md hover:bg-gray-400 hover:text-gray-700"
        >
          <DocumentDuplicateIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default JsonTab;
