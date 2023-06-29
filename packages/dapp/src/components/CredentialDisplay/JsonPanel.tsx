import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { VerifiableCredential } from '@veramo/core';

import { copyToClipboard } from '@/utils/string';

type JsonPanelProps = {
  credential: VerifiableCredential;
};

const JsonPanel = ({ credential }: JsonPanelProps) => (
  <div className="dark:bg-navy-blue-300 dark:border-navy-blue-400 group relative w-full overflow-hidden rounded-2xl border border-gray-300 bg-gray-200 p-2">
    <textarea
      className="group-hover:scrollbar-thumb-orange-300 dark:text-navy-blue-700 dark:bg-navy-blue-300 scrollbar-thin scrollbar-thumb-orange-300/0 scrollbar-thumb-rounded-full font-jetbrains-mono min-h-[60vh] w-full resize-none rounded-2xl bg-gray-200 p-2 text-gray-800 focus:outline-none"
      disabled
      value={JSON.stringify(credential, null, 4)}
    />
    <button
      onClick={() => {
        copyToClipboard(JSON.stringify(credential, null, 4));
      }}
      className="animated-transition absolute bottom-3 right-6 rounded-full bg-gray-500 p-1 text-gray-900 shadow-md hover:bg-gray-400 hover:text-gray-700"
    >
      <DocumentDuplicateIcon className="h-5 w-5" />
    </button>
  </div>
);

export default JsonPanel;
