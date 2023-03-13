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
      <div className="group relative z-0 rounded-2xl bg-orange-100 pt-1 pr-2">
        <textarea
          className="group-hover:scrollbar-thumb-orange-300 scrollbar-thin scrollbar-thumb-orange-300/0 scrollbar-thumb-rounded-full font-jetbrains-mono min-h-[60vh] w-full resize-none rounded-2xl bg-orange-100 p-2 text-orange-900 focus:outline-none "
          disabled
          value={JSON.stringify(vc.data, null, 4)}
        />

        <button
          onClick={() => {
            copyToClipboard(JSON.stringify(vc.data, null, 4));
          }}
          className="animated-transition absolute bottom-3 right-6 rounded-full border border-gray-200 bg-orange-300 p-1 text-orange-900 shadow-md hover:bg-orange-200 hover:text-orange-800"
        >
          <DocumentDuplicateIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default JsonTab;
