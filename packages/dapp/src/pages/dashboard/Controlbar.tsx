import React, { useState } from 'react';
import {
  AvailableVCStores,
  QueryVCsRequestResult,
} from '@blockchain-lab-um/ssi-snap-types';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { W3CVerifiableCredential } from '@veramo/core';
import { shallow } from 'zustand/shallow';

import Button from '@/components/Button';
import ImportModal from '@/components/ImportModal';
import DataStoreCombobox from '@/components/VCTable/DataStoreCombobox';
import GlobalFilter from '@/components/VCTable/GlobalFilter';
import ViewTabs from '@/components/VCTable/ViewTabs';
import { useSnapStore } from '@/utils/stores';

type ControlbarProps = {
  vcs: QueryVCsRequestResult[];
  isConnected: boolean;
};

export const Controlbar = ({ vcs, isConnected }: ControlbarProps) => {
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const { api, changeVcs } = useSnapStore(
    (state) => ({
      api: state.snapApi,
      changeVcs: state.changeVcs,
    }),
    shallow
  );

  const refreshVCs = () => {
    setSpinner(true);
    api
      ?.queryVCs()
      .then((res) => {
        changeVcs(res);
        setSpinner(false);
      })
      .catch((err) => {
        console.log(err);
        setSpinner(false);
      });
  };

  const saveVC = async (vc: string, stores: AvailableVCStores[]) => {
    let vcObj;
    try {
      vcObj = JSON.parse(vc) as W3CVerifiableCredential;
    } catch (err) {
      console.log(err);
      return false;
    }
    const res = await api?.saveVC(vcObj, {
      store: stores,
    });
    if (res && res.length > 0) {
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
    return true;
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
              className={`w-9 h-9 bg-white flex justify-center items-center text-orange-500 rounded-full shadow-md border border-gray-200 `}
              onClick={() => refreshVCs()}
            >
              <ArrowPathIcon
                className={`w-6 h-6 ${spinner ? 'animate-spin' : ''}`}
              />
            </button>
          )}
          {isConnected && (
            <Button
              variant="white"
              size="sm"
              shadow="md"
              onClick={() => setImportModalOpen(true)}
            >
              Save VC
            </Button>
          )}
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
