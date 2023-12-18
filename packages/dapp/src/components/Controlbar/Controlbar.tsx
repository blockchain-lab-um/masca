'use client';

import { useState } from 'react';
import {
  isError,
  type AvailableCredentialStores,
  type QueryCredentialsRequestResult,
} from '@blockchain-lab-um/masca-connector';
import { ArrowPathIcon, PlusIcon } from '@heroicons/react/24/outline';
import { ShareIcon } from '@heroicons/react/24/solid';
import { Tooltip } from '@nextui-org/react';
import { W3CVerifiableCredential } from '@veramo/core';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import GlobalFilter from '@/components/Controlbar/GlobalFilter';
import ViewTabs from '@/components/Controlbar/ViewTabs';
import ImportModal from '@/components/ImportModal';
import {
  removeCredentialSubjectFilterString,
  stringifyCredentialSubject,
} from '@/utils/format';
import {
  useGeneralStore,
  useMascaStore,
  useTableStore,
  useToastStore,
} from '@/stores';
import { useAuthStore } from '@/stores/authStore';
import { useShareModalStore } from '@/stores/shareModalStore';
import FilterPopover from './FilterPopover';

// import PlaygroundModal from '../PlaygroundModal';

const Controlbar = () => {
  const t = useTranslations('Controlbar');
  // Local state
  const [importModalOpen, setImportModalOpen] = useState(false);
  // const [playgroundModalOpen, setPlaygroundModalOpen] = useState(false);
  const [spinner, setSpinner] = useState(false);

  // Global state
  const { isSignedIn, changeIsSignInModalOpen } = useAuthStore((state) => ({
    isSignedIn: state.isSignedIn,
    changeIsSignInModalOpen: state.changeIsSignInModalOpen,
  }));
  const isConnected = useGeneralStore((state) => state.isConnected);
  const { api, vcs, changeLastFetch, changeVcs } = useMascaStore((state) => ({
    api: state.mascaApi,

    vcs: state.vcs,
    changeLastFetch: state.changeLastFetch,
    changeVcs: state.changeVcs,
  }));
  const selectedCredentials = useTableStore(
    (state) => state.selectedCredentials
  );
  const { setShareCredentials, setShareModalMode, setIsShareModalOpen } =
    useShareModalStore((state) => ({
      setShareCredentials: state.setCredentials,
      setShareModalMode: state.setMode,
      setIsShareModalOpen: state.setIsOpen,
    }));

  const refreshVCs = async () => {
    if (!api) return;
    setSpinner(true);

    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: t('query'),
        type: 'normal',
        loading: true,
        link: null,
      });
    }, 200);

    const res = await api.queryCredentials();
    useToastStore.setState({
      open: false,
    });

    if (isError(res)) {
      console.log(res.error);
      setSpinner(false);
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('query-error'),
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
      return;
    }

    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: t('query-success'),
        type: 'success',
        loading: false,
        link: null,
      });
    }, 200);

    changeLastFetch(Date.now());
    changeVcs(res.data.map((vc) => stringifyCredentialSubject(vc)));
    setSpinner(false);
  };

  const saveCredential = async (
    vc: W3CVerifiableCredential,
    stores: AvailableCredentialStores[]
  ) => {
    if (!api) return false;

    const res = await api.saveCredential(vc, {
      store: stores,
    });

    if (isError(res)) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: res.error,
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
      return false;
    }

    if (res.data && res.data.length > 0) {
      const newVcs: QueryCredentialsRequestResult[] = [];
      res.data.forEach((metadata: any) => {
        const finalVC = {
          data: vc,
          metadata,
        } as QueryCredentialsRequestResult;
        newVcs.push(finalVC);
      });

      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('save-success'),
          type: 'success',
          loading: false,
          link: null,
        });
      }, 200);
      const queryResult = await api.queryCredentials();
      if (isError(queryResult)) {
        setTimeout(() => {
          useToastStore.setState({
            open: true,
            title: t('query-error'),
            type: 'error',
            loading: false,
            link: null,
          });
        }, 200);
        return false;
      }

      changeLastFetch(Date.now());

      if (queryResult.data) {
        changeVcs(
          queryResult.data.map((modifyVC) =>
            stringifyCredentialSubject(modifyVC)
          )
        );
      }
    }
    return true;
  };

  return (
    <div className={clsx(isConnected ? '' : 'hidden')}>
      <div className="mb-4 grid grid-cols-11 grid-rows-2 gap-y-4 md:grid-rows-1">
        {vcs.length > 0 && (
          <div className="col-span-11 col-start-1 row-start-2 flex gap-x-2 md:col-span-5 md:row-start-1">
            <FilterPopover vcs={vcs} />
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
              {/* <button
                className={clsx(
                  'dark:bg-navy-blue-700 dark:text-navy-blue-50 group flex h-[37px] w-[37px] md:h-[43px] md:w-[43px]',
                  'items-center justify-center rounded-full bg-white text-gray-700 shadow-md outline-none focus:outline-none'
                )}
                onClick={() => setPlaygroundModalOpen(true)}
              >
                <PlusIcon className={`group-hover:animate-pingOnce h-6 w-6`} />
              </button> */}
              {selectedCredentials.length > 0 && (
                <Tooltip
                  content={isSignedIn ? t('share') : t('sign-in-to-share')}
                  className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
                >
                  <button
                    className={clsx(
                      'dark:bg-navy-blue-700 dark:text-navy-blue-50 group flex h-[37px] w-[37px] md:h-[43px] md:w-[43px]',
                      'items-center justify-center rounded-full bg-white text-gray-700 shadow-md outline-none focus:outline-none'
                    )}
                    onClick={() => {
                      if (!isSignedIn) {
                        changeIsSignInModalOpen(true);
                        return;
                      }
                      setShareModalMode('multiple');
                      setShareCredentials(
                        selectedCredentials.map(
                          (vc) => removeCredentialSubjectFilterString(vc).data
                        )
                      );
                      setIsShareModalOpen(true);
                    }}
                  >
                    <ShareIcon className="h-6 w-6" />
                  </button>
                </Tooltip>
              )}
              <Tooltip
                content={t('import')}
                className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
              >
                <button
                  className={clsx(
                    'dark:bg-navy-blue-700 dark:text-navy-blue-50 group flex h-[37px] w-[37px] md:h-[43px] md:w-[43px]',
                    'items-center justify-center rounded-full bg-white text-gray-700 shadow-md outline-none focus:outline-none'
                  )}
                  onClick={() => setImportModalOpen(true)}
                >
                  <PlusIcon
                    className={`group-hover:animate-pingOnce h-6 w-6`}
                  />
                </button>
              </Tooltip>
            </>
          )}
          {vcs.length > 0 && (
            <Tooltip
              content={t('refresh')}
              className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
            >
              <button
                className={clsx(
                  'dark:bg-navy-blue-700 dark:text-navy-blue-50 group flex h-[37px] w-[37px] md:h-[43px] md:w-[43px]',
                  'items-center justify-center rounded-full bg-white text-gray-700 shadow-md outline-none focus:outline-none'
                )}
                onClick={() => refreshVCs()}
              >
                <ArrowPathIcon
                  className={clsx(
                    'group-hover:animate-spinOnce h-6 w-6 duration-75',
                    spinner ? 'animate-spinRefresh duration-75' : null
                  )}
                />
              </button>
            </Tooltip>
          )}
        </div>
      </div>
      <ImportModal
        isOpen={importModalOpen}
        setOpen={setImportModalOpen}
        importVC={saveCredential}
      />
      {/* <PlaygroundModal
        open={playgroundModalOpen}
        setOpen={setPlaygroundModalOpen}
      /> */}
    </div>
  );
};

export default Controlbar;
