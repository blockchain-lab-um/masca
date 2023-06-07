'use client';

import React, { useState } from 'react';
import {
  AvailableVCStores,
  QueryVCsRequestResult,
} from '@blockchain-lab-um/masca-types';
import { isError } from '@blockchain-lab-um/utils';
import { ArrowPathIcon, PlusIcon } from '@heroicons/react/24/outline';
import { W3CVerifiableCredential } from '@veramo/core';
import clsx from 'clsx';
import { shallow } from 'zustand/shallow';

import ImportModal from '@/components/ImportModal';
import DataStoreCombobox from '@/components/VCTable/DataStoreCombobox';
import GlobalFilter from '@/components/VCTable/GlobalFilter';
import ViewTabs from '@/components/VCTable/ViewTabs';
import { useGeneralStore, useMascaStore, useToastStore } from '@/stores';

const Controlbar = () => {
  // Local state
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [spinner, setSpinner] = useState(false);

  // Stores
  const isConnected = useGeneralStore((state) => state.isConnected);
  const vcs = useMascaStore((state) => state.vcs);
  const { setTitle, setLoading, setToastOpen, setType } = useToastStore(
    (state) => ({
      setTitle: state.setTitle,
      setText: state.setText,
      setLoading: state.setLoading,
      setToastOpen: state.setOpen,
      setType: state.setType,
    }),
    shallow
  );
  const { api, changeVcs } = useMascaStore(
    (state) => ({
      api: state.mascaApi,
      changeVcs: state.changeVcs,
    }),
    shallow
  );

  const refreshVCs = async () => {
    if (!api) return;
    setSpinner(true);

    const res = await api.queryVCs();

    if (isError(res)) {
      console.log(res.error);

      setSpinner(false);
      setToastOpen(false);
      setTimeout(() => {
        setTitle('Failed to query credentials');
        setType('error');
        setLoading(false);
        setToastOpen(true);
      }, 100);
      return;
    }

    changeVcs(res.data);
    setSpinner(false);
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

      const queryResult = await api.queryVCs();
      if (isError(queryResult)) {
        return false;
      }
      if (queryResult.data) {
        changeVcs(queryResult.data);
      }
    }
    return true;
  };

  return (
    <div className={clsx(isConnected ? '' : 'hidden')}>
      <div className="mb-4 grid grid-cols-11 grid-rows-2 gap-y-4 md:grid-rows-1">
        {vcs.length > 0 && (
          <div className="col-span-11 col-start-1 row-start-2 flex gap-x-2 md:col-span-5 md:row-start-1">
            <DataStoreCombobox isConnected={isConnected} vcs={vcs} />
            <GlobalFilter isConnected={isConnected} vcs={vcs} />
          </div>
        )}

        {vcs.length > 0 && (
          <div className="col-span-5 col-start-1 row-start-1 flex justify-start sm:row-start-1 md:col-span-1 md:col-start-7 lg:col-start-6">
            <ViewTabs />
          </div>
        )}
        <div className="col-span-5 col-start-7 flex justify-end gap-x-2 max-md:row-start-2 max-sm:row-start-1 md:row-start-1">
          {isConnected && (
            <button
              className={`dark:bg-navy-blue-700 dark:text-navy-blue-50 group flex h-[43px] w-[43px] items-center justify-center rounded-full bg-white text-gray-700 shadow-md`}
              onClick={() => setImportModalOpen(true)}
            >
              <PlusIcon className={`group-hover:animate-pingOnce h-6 w-6`} />
            </button>
          )}
          {vcs.length > 0 && (
            <button
              className={`dark:bg-navy-blue-700 dark:text-navy-blue-50 group flex h-[43px] w-[43px] items-center justify-center rounded-full bg-white text-gray-700 shadow-md`}
              onClick={() => refreshVCs()}
            >
              <ArrowPathIcon
                className={`group-hover:animate-spinOnce h-6 w-6 duration-75 ${
                  spinner ? 'animate-spinRefresh duration-75' : ''
                }`}
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
    </div>
  );
};

export default Controlbar;
