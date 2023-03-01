import React, { useState } from 'react';
import {
  AvailableVCStores,
  QueryVCsRequestResult,
} from '@blockchain-lab-um/ssi-snap-types';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { W3CVerifiableCredential } from '@veramo/core';
import Button from 'src/components/Button';
import ImportModal from 'src/components/ImportModal';
import ViewTabs from 'src/components/VCTable/ViewTabs';
import { useSnapStore } from 'src/utils/store';

import DataStoreCombobox from '../../components/VCTable/DataStoreCombobox';
import GlobalFilter from '../../components/VCTable/GlobalFilter';

type ControlbarProps = {
  vcs: QueryVCsRequestResult[];
  isConnected: boolean;
};

export const Controlbar = ({ vcs, isConnected }: ControlbarProps) => {
  const [importModalOpen, setImportModalOpen] = useState(false);
  const api = useSnapStore((state) => state.snapApi);
  const changeVcs = useSnapStore((state) => state.changeVcs);

  const refreshVCs = async () => {
    const res = await api?.queryVCs();
    if (res) {
      changeVcs(res);
    }
  };

  const saveVC = async (vc: string, stores: AvailableVCStores[]) => {
    const res = await api?.saveVC(JSON.parse(vc) as W3CVerifiableCredential, {
      store: stores,
    });
    if (res && res.length > 0) {
      console.log('VC saved', res);
      const newVcs: QueryVCsRequestResult[] = [];
      res.forEach((metadata) => {
        const finalVC = {
          data: JSON.parse(vc) as W3CVerifiableCredential,
          metadata,
        } as QueryVCsRequestResult;
        newVcs.push(finalVC);
      });
      changeVcs([...vcs, ...newVcs]);
    }
  };

  return (
    <>
      <div className="grid grid-cols-11 mb-4 mt-6">
        <div className="col-start-1 col-span-5 flex gap-x-1">
          <DataStoreCombobox isConnected={isConnected} vcs={vcs} />
          <GlobalFilter isConnected={isConnected} vcs={vcs} />
        </div>

        {vcs.length > 0 && (
          <div className="col-start-6 flex justify-center">
            <ViewTabs />
          </div>
        )}
        <div className="col-start-7 col-span-5 flex justify-end gap-x-1">
          {vcs.length > 0 && (
            <button
              className="w-9 h-9 bg-white flex justify-center items-center text-orange-500 rounded-full shadow-md border border-gray-200"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={() => refreshVCs()}
            >
              <ArrowPathIcon className="w-6 h-6" />
            </button>
          )}
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
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        importVC={saveVC}
      />
    </>
  );
};
