import React, { useState } from 'react';
import {
  AvailableVCStores,
  QueryVCsRequestResult,
} from '@blockchain-lab-um/ssi-snap-types';
import { isError } from '@blockchain-lab-um/utils';
import { ArrowPathIcon, PlusIcon } from '@heroicons/react/24/outline';
import { W3CVerifiableCredential } from '@veramo/core';
import { shallow } from 'zustand/shallow';

import ImportModal from '@/components/ImportModal';
import DataStoreCombobox from '@/components/VCTable/DataStoreCombobox';
import GlobalFilter from '@/components/VCTable/GlobalFilter';
import ViewTabs from '@/components/VCTable/ViewTabs';
import { useSnapStore } from '@/utils/stores';

type ControlbarProps = {
  vcs: QueryVCsRequestResult[];
  isConnected: boolean;
};

const Controlbar = ({ vcs, isConnected }: ControlbarProps) => {
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
    if (!api) return;
    setSpinner(true);
    api
      .queryVCs()
      .then((res) => {
        if (isError(res)) {
          console.log(res);
          setSpinner(false);
          return;
        }
        changeVcs(res.data);
        setSpinner(false);
      })
      .catch((err) => {
        console.log(err);
        setSpinner(false);
      });
  };

  const saveVC = async (vc: string, stores: AvailableVCStores[]) => {
    if (!api) return false;
    let vcObj;
    try {
      vcObj = JSON.parse(vc) as W3CVerifiableCredential;
    } catch (err) {
      console.log(err);
      return false;
    }
    const res = await api.saveVC(vcObj, {
      store: stores,
    });
    if (isError(res)) {
      console.log('error', res);
      return false;
    }
    if (res.data && res.data.length > 0) {
      const newVcs: QueryVCsRequestResult[] = [];
      res.data.forEach((metadata) => {
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
      <div className="mb-4 mt-6 grid grid-cols-11">
        {vcs.length > 0 && (
          <div className="col-span-5 col-start-1 flex gap-x-1">
            <DataStoreCombobox isConnected={isConnected} vcs={vcs} />
            <GlobalFilter isConnected={isConnected} vcs={vcs} />
          </div>
        )}

        {vcs.length > 0 && (
          <div className="col-start-6 flex justify-center">
            <ViewTabs />
          </div>
        )}
        <div className="col-span-5 col-start-7 flex justify-end gap-x-1">
          {isConnected && (
            <button
              className={`dark:bg-navy-blue-700 dark:text-navy-blue-50 flex h-[43px] w-[43px] items-center justify-center rounded-full bg-white text-gray-700 shadow-md`}
              onClick={() => setImportModalOpen(true)}
            >
              <PlusIcon className={`h-6 w-6`} />
            </button>
          )}
          {vcs.length > 0 && (
            <button
              className={`dark:bg-navy-blue-700 dark:text-navy-blue-50 flex h-[43px] w-[43px] items-center justify-center rounded-full bg-white text-gray-700 shadow-md`}
              onClick={() => refreshVCs()}
            >
              <ArrowPathIcon
                className={`h-6 w-6 ${spinner ? 'animate-spin' : ''}`}
              />
            </button>
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

export default Controlbar;
