import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
import React, { useState } from 'react';
import Button from 'src/components/Button';
import ImportModal from 'src/components/ImportModal';
import ViewTabs from 'src/components/VCTable/ViewTabs';
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
    <>
      <div className="grid grid-cols-11 mb-4 mt-6">
        <div className="col-start-1 col-span-5 flex">
          <DataStoreCombobox isConnected={isConnected} vcs={vcs} />
          <GlobalFilter isConnected={isConnected} vcs={vcs} />
        </div>
        <div className="col-start-6">
          <ViewTabs />
        </div>
        <div className="col-start-12 flex">
          <Button
            variant="white"
            size="sm"
            shadow="md"
            onClick={() => setImportModalOpen(true)}
          >
            Save VC
          </Button>
        </div>
      </div>
      <ImportModal
        open={importModalOpen}
        setOpen={setImportModalOpen}
        importVC={saveVC}
      />
    </>
  );
};
