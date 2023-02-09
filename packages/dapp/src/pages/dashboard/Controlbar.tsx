import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
import React, { useState } from 'react';
import ImportModal from 'src/components/ImportModal';
import DataStoreCombobox from '../../components/VCTable/DataStoreCombobox';
import GlobalFilter from '../../components/VCTable/GlobalFilter';

type ControlbarProps = {
  vcs: QueryVCsRequestResult[];
  isConnected: boolean;
};

export const Controlbar = ({ vcs, isConnected }: ControlbarProps) => {
  const [importModalOpen, setImportModalOpen] = useState(false);

  const saveVC = (vc: QueryVCsRequestResult) => {};

  return (
    <div className="flex gap-x-2 justify-start mb-4 mt-6">
      <DataStoreCombobox isConnected={isConnected} vcs={vcs} />
      <GlobalFilter isConnected={isConnected} vcs={vcs} />
      <button onClick={() => setImportModalOpen(true)}>Import</button>
      <ImportModal
        open={importModalOpen}
        setOpen={setImportModalOpen}
        importVC={saveVC}
      />
    </div>
  );
};
