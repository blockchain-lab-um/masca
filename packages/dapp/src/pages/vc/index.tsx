import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Tab } from '@headlessui/react';
import {
  ArrowDownTrayIcon,
  Cog6ToothIcon,
  ShareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

import Button from '@/components/Button';
import ConnectedProvider from '@/components/ConnectedProvider';
import FormatedTab from '@/components/VC/tabs/FormatedTab';
import JsonTab from '@/components/VC/tabs/JsonTab';
import { useSnapStore } from '@/utils/stores';

const VC = () => {
  const router = useRouter();
  const { id } = router.query;
  const vcs = useSnapStore((state) => state.vcs);
  const vc = vcs.find((VCobj) => VCobj.metadata.id === id);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modifyDSModalOpen, setModifyDSModalOpen] = useState(false);

  if (!vc) {
    return (
      <>
        <Head>
          <title>Masca | Settings</title>
          <meta name="description" content="Settings page for Masca." />
        </Head>
        <div className="flex h-full min-h-[50vh] justify-center rounded-3xl bg-white p-5 shadow-lg  dark:bg-gray-800 dark:shadow-orange-900">
          <ConnectedProvider>
            <div className="flex flex-col">VC not found!</div>
          </ConnectedProvider>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Masca | Settings</title>
        <meta name="description" content="Settings page for Masca." />
      </Head>
      <div className="grid place-items-center">
        <div className="w-full max-w-sm md:max-w-xl lg:max-w-2xl xl:w-[50rem] xl:max-w-[50rem]">
          <Tab.Group>
            <div className="flex items-center justify-between">
              <Tab.List className="mb-2 flex max-w-fit space-x-1 rounded-full border border-gray-200 bg-white p-1 text-orange-900 shadow-md">
                <Tab
                  className={({ selected }) =>
                    clsx(
                      'animated-transition w-full rounded-full py-2 px-4 text-sm font-semibold text-gray-500',
                      selected
                        ? 'bg-orange-100 text-orange-500'
                        : 'hover:bg-orange-100 hover:text-orange-500'
                    )
                  }
                >
                  Normal
                </Tab>
                <Tab
                  className={({ selected }) =>
                    clsx(
                      'animated-transition w-full rounded-full py-2 px-4 text-sm font-semibold text-gray-500',
                      selected
                        ? 'bg-orange-100 text-orange-500'
                        : 'hover:bg-orange-100 hover:text-orange-500'
                    )
                  }
                >
                  JSON
                </Tab>
              </Tab.List>
              <div className="flex gap-1">
                <Button
                  variant="white"
                  size="icon"
                  shadow="md"
                  onClick={() => setModifyDSModalOpen(true)}
                >
                  <Cog6ToothIcon className="h-6 w-6 text-gray-700" />
                </Button>
                <Button
                  variant="white"
                  size="icon"
                  shadow="md"
                  onClick={() => console.log('not implemented yet')}
                >
                  <ArrowDownTrayIcon className="h-6 w-6 text-gray-700" />
                </Button>
                <Button
                  variant="white"
                  size="icon"
                  shadow="md"
                  onClick={() => console.log('not implemented yet')}
                >
                  <ShareIcon className="h-6 w-6 text-gray-700" />
                </Button>
                <Button
                  variant="white"
                  size="icon"
                  shadow="md"
                  onClick={() => setDeleteModalOpen(true)}
                >
                  <TrashIcon className="h-6 w-6 text-gray-700" />
                </Button>
              </div>
            </div>
            <div className="mt-2 h-full w-full rounded-3xl border border-gray-200 bg-white pt-2 shadow-lg dark:bg-gray-800 dark:shadow-orange-900">
              <ConnectedProvider>
                <div className="flex w-full justify-between px-5 pt-4">
                  <button
                    onClick={() => router.back()}
                    className="animated-transition rounded-full p-1 text-gray-900 hover:bg-orange-100 hover:text-orange-700"
                  >
                    <ArrowLeftIcon className="h-6 w-6" />
                  </button>
                  <div className="text-h3 font-semibold text-gray-900">
                    Verifiable Credential
                  </div>
                </div>
                <div className="w-full px-2 sm:px-0">
                  <Tab.Panels className="w-full">
                    <Tab.Panel>
                      <FormatedTab
                        vc={vc}
                        deleteModalOpen={deleteModalOpen}
                        setDeleteModalOpen={setDeleteModalOpen}
                        modifyDSModalOpen={modifyDSModalOpen}
                        setModifyDSModalOpen={setModifyDSModalOpen}
                      />
                    </Tab.Panel>
                    <Tab.Panel className="w-full">
                      <JsonTab vc={vc} />
                    </Tab.Panel>
                  </Tab.Panels>
                </div>
              </ConnectedProvider>
            </div>
          </Tab.Group>
        </div>
      </div>
    </>
  );
};

export default VC;
