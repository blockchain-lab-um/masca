'use client';

import { useState } from 'react';
import {
  AvailableVCStores,
  QueryVCsRequestResult,
} from '@blockchain-lab-um/masca-types';
import { isError } from '@blockchain-lab-um/utils';
import { ArrowPathIcon, PlusIcon } from '@heroicons/react/24/outline';
import { W3CVerifiableCredential } from '@veramo/core';
import clsx from 'clsx';
import { normalizeCredential } from 'did-jwt-vc';
import { shallow } from 'zustand/shallow';

import ImportModal from '@/components/ImportModal';
import DataStoreCombobox from '@/components/VCTable/DataStoreCombobox';
import GlobalFilter from '@/components/VCTable/GlobalFilter';
import ViewTabs from '@/components/VCTable/ViewTabs';
import { useGeneralStore, useMascaStore, useToastStore } from '@/stores';
import PlaygroundModal from '../PlaygroundModal';

const Controlbar = () => {
  // Local state
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [playgroundModalOpen, setPlaygroundModalOpen] = useState(false);
  const [spinner, setSpinner] = useState(false);

  // Stores
  const isConnected = useGeneralStore((state) => state.isConnected);
  const { vcs, changeLastFetch } = useMascaStore(
    (state) => ({
      vcs: state.vcs,
      changeLastFetch: state.changeLastFetch,
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

    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: 'Querying credentials',
        type: 'normal',
        loading: true,
      });
    }, 200);

    const res = await api.queryVCs();
    useToastStore.setState({
      open: false,
    });

    if (isError(res)) {
      console.log(res.error);
      setSpinner(false);
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: 'Failed to query credentials',
          type: 'error',
          loading: false,
        });
      }, 200);
      return;
    }

    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: 'Successfully queried credentials',
        type: 'success',
        loading: false,
      });
    }, 200);

    changeLastFetch(Date.now());
    changeVcs(res.data);
    setSpinner(false);
  };

  const saveVC = async (vc: string, stores: AvailableVCStores[]) => {
    if (!api) return false;
    let vcObj: W3CVerifiableCredential;

    try {
      vcObj = JSON.parse(vc) as W3CVerifiableCredential;
    } catch (err) {
      try {
        vcObj = normalizeCredential(vc) as W3CVerifiableCredential;
      } catch (normalizationError) {
        console.log(normalizationError);

        setSpinner(false);
        setTimeout(() => {
          useToastStore.setState({
            open: true,
            title: 'Failed to save VC; VC was invalid',
            type: 'error',
            loading: false,
          });
        }, 100);

        return false;
      }
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
      res.data.forEach((metadata: any) => {
        const finalVC = {
          data: vcObj,
          metadata,
        } as QueryVCsRequestResult;
        newVcs.push(finalVC);
      });
      changeVcs([...vcs, ...newVcs]);

      const queryResult = await api.queryVCs();
      if (isError(queryResult)) {
        return false;
      }

      changeLastFetch(Date.now());

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
        <div
          className={`col-span-5 col-start-7 flex justify-end gap-x-2 ${
            vcs.length === 0
              ? 'row-start-2'
              : ' max-md:row-start-2 max-sm:row-start-1 md:row-start-1'
          }`}
        >
          {isConnected && (
            <>
              <button
                className={clsx(
                  'dark:bg-navy-blue-700 dark:text-navy-blue-50 group flex h-[37px] w-[37px] md:h-[43px] md:w-[43px]',
                  'items-center justify-center rounded-full bg-white text-gray-700 shadow-md outline-none focus:outline-none'
                )}
                onClick={() => setPlaygroundModalOpen(true)}
              >
                <PlusIcon className={`group-hover:animate-pingOnce h-6 w-6`} />
              </button>
              <button
                className={clsx(
                  'dark:bg-navy-blue-700 dark:text-navy-blue-50 group flex h-[37px] w-[37px] md:h-[43px] md:w-[43px]',
                  'items-center justify-center rounded-full bg-white text-gray-700 shadow-md outline-none focus:outline-none'
                )}
                onClick={() => setImportModalOpen(true)}
              >
                <PlusIcon className={`group-hover:animate-pingOnce h-6 w-6`} />
              </button>
            </>
          )}
          {vcs.length > 0 && (
            <button
              className={clsx(
                'dark:bg-navy-blue-700 dark:text-navy-blue-50 group flex h-[37px] w-[37px] md:h-[43px] md:w-[43px]',
                'items-center justify-center rounded-full bg-white text-gray-700 shadow-md outline-none focus:outline-none'
              )}
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
      <PlaygroundModal
        open={playgroundModalOpen}
        setOpen={setPlaygroundModalOpen}
      />
    </div>
  );
};

export default Controlbar;
