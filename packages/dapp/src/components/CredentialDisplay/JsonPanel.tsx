import { QueryVCsRequestResult } from '@blockchain-lab-um/masca-types';
import { DocumentDuplicateIcon } from '@heroicons/react/24/solid';

import DeleteModal from '@/components/DeleteModal';
import ModifyDSModal from '@/components/ModifyDSModal';
import { copyToClipboard } from '@/utils/string';

interface JsonTabProps {
  vc: QueryVCsRequestResult;
  deleteModalOpen: boolean;
  modifyDSModalOpen: boolean;
  setDeleteModalOpen: (value: boolean) => void;
  setModifyDSModalOpen: (value: boolean) => void;
}

const JsonTab = ({
  vc,
  setDeleteModalOpen,
  setModifyDSModalOpen,
  modifyDSModalOpen,
  deleteModalOpen,
}: JsonTabProps) => (
  <div className="px-4 pb-4 xl:px-8 xl:pb-8">
    <div className="dark:bg-navy-blue-300 dark:border-navy-blue-400 group relative z-0 mt-8 rounded-2xl border border-gray-300 bg-gray-200 pr-2 pt-1">
      <textarea
        className="group-hover:scrollbar-thumb-orange-300 dark:text-navy-blue-700 dark:bg-navy-blue-300 scrollbar-thin scrollbar-thumb-orange-300/0 scrollbar-thumb-rounded-full font-jetbrains-mono min-h-[60vh] w-full resize-none rounded-2xl bg-gray-200 p-2 text-gray-800 focus:outline-none"
        disabled
        value={JSON.stringify(vc.data, null, 4)}
      />

      <button
        onClick={() => {
          copyToClipboard(JSON.stringify(vc.data, null, 4));
        }}
        className="animated-transition absolute bottom-3 right-6 rounded-full bg-gray-500 p-1 text-gray-900 shadow-md hover:bg-gray-400 hover:text-gray-700"
      >
        <DocumentDuplicateIcon className="h-5 w-5" />
      </button>
    </div>
    <DeleteModal open={deleteModalOpen} setOpen={setDeleteModalOpen} vc={vc} />
    <ModifyDSModal
      open={modifyDSModalOpen}
      setOpen={setModifyDSModalOpen}
      vc={vc}
    />
  </div>
);

export default JsonTab;
