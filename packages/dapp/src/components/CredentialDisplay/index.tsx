'use client';

import { useState } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { Tab } from '@headlessui/react';
import {
  ArrowDownTrayIcon,
  ArrowLeftIcon,
  Cog6ToothIcon,
  ShareIcon,
  TrashIcon,
} from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import Button from '@/components/Button';
import DeleteModal from '@/components/DeleteModal';
import ModifyDSModal from '@/components/ModifyDSModal';
import StoreIcon from '@/components/StoreIcon';
import Tooltip from '@/components/Tooltip';
import { removeCredentialSubjectFilterString } from '@/utils/format';
import { useMascaStore, useTableStore } from '@/stores';
import FormatedPanel from './FormatedPanel';
import JsonPanel from './JsonPanel';

type CredentialDisplayProps = {
  id: string;
};

const CredentialDisplay = ({ id }: CredentialDisplayProps) => {
  const t = useTranslations('CredentialDisplay');
  const router = useRouter();
  const vcs = useMascaStore((state) => state.vcs);
  const setSelectedVCs = useTableStore((state) => state.setSelectedVCs);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modifyDSModalOpen, setModifyDSModalOpen] = useState(false);

  console.log(id);
  const vcWithFilterString = vcs.find((vcObj) => vcObj.metadata.id === id);
  const vc = vcWithFilterString
    ? removeCredentialSubjectFilterString(vcWithFilterString)
    : null;

  if (!vc) {
    return notFound();
  }

  return (
    <>
      <Tab.Group>
        <div className="flex items-center justify-between">
          <Tab.List className="dark:bg-navy-blue-700 relative flex w-36 shrink-0 justify-between rounded-full bg-white shadow-md">
            <Tab className="outline-none focus-visible:outline-none">
              {({ selected }) => (
                <div className="relative">
                  <div
                    className={clsx(
                      'transition-width dark:bg-orange-accent-dark h-10 rounded-full bg-pink-100 ease-in-out',
                      selected ? 'w-20 translate-x-0' : 'w-16 translate-x-20'
                    )}
                  ></div>
                  <span
                    className={clsx(
                      'animated-transition absolute left-0 top-2 z-20 ml-3.5 rounded-full',
                      selected
                        ? 'dark:text-navy-blue-900 text-pink-600'
                        : 'dark:text-navy-blue-300 dark:hover:text-navy-blue-200 text-gray-700 hover:text-gray-500'
                    )}
                  >
                    Normal
                  </span>
                </div>
              )}
            </Tab>
            <Tab
              className={({ selected }) =>
                clsx(
                  'animated-transition z-20 mr-3 rounded-full outline-none focus-visible:outline-none',
                  selected
                    ? 'dark:text-navy-blue-900 text-pink-600'
                    : 'dark:text-navy-blue-300 dark:hover:text-navy-blue-200 text-gray-700 hover:text-gray-500'
                )
              }
            >
              JSON
            </Tab>
          </Tab.List>
          <div className="flex gap-1.5">
            <button
              className="dark:bg-navy-blue-700 dark:text-navy-blue-50 flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-700 shadow-md"
              onClick={() => setModifyDSModalOpen(true)}
            >
              <Cog6ToothIcon className="h-6 w-6" />
            </button>
            <button
              className="dark:bg-navy-blue-800 dark:text-navy-blue-500 flex h-11 w-11 cursor-default items-center justify-center rounded-full bg-gray-100 text-gray-500 shadow-md"
              onClick={() => console.log('not implemented yet')}
            >
              <ArrowDownTrayIcon className="h-6 w-6" />
            </button>
            <button
              className="dark:bg-navy-blue-800 dark:text-navy-blue-500 flex h-11 w-11 cursor-default items-center justify-center rounded-full bg-gray-100 text-gray-500 shadow-md"
              onClick={() => console.log('not implemented yet')}
            >
              <ShareIcon className="h-6 w-6 " />
            </button>
            <button
              className="dark:bg-navy-blue-700 dark:text-navy-blue-50 flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-700 shadow-md"
              onClick={() => setDeleteModalOpen(true)}
            >
              <TrashIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="dark:bg-navy-blue-800 mt-4 h-full w-full rounded-3xl bg-white p-6 shadow-lg">
          <div className="mb-2 flex w-full items-center justify-between">
            <button
              onClick={() => router.back()}
              className="animated-transition dark:text-navy-blue-50 dark:hover:bg-navy-blue-700 rounded-full p-1 text-gray-900 hover:bg-pink-100 hover:text-pink-700"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <div className="text-h4 dark:text-navy-blue-50 font-semibold text-gray-900">
              {t('title')}
            </div>
          </div>
          <div className="w-full px-2 sm:px-0">
            <Tab.Panels className="w-full">
              <Tab.Panel>
                <FormatedPanel credential={vc.data} />
                <div className="mt-8 flex flex-col space-y-2 px-6">
                  <h1 className="text-md dark:text-orange-accent-dark font-medium text-pink-500">
                    {t('datastores')}
                  </h1>
                  {vc.metadata.store && (
                    <div className="flex gap-x-1">
                      {vc.metadata.store.map((store) => (
                        <Tooltip tooltip={store} key={store}>
                          <StoreIcon store={store} />
                        </Tooltip>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-8 flex flex-col md:flex-row">
                  <div className="flex-1" />
                  <div className="flex flex-1 justify-end">
                    <Link href="/app/create-verifiable-presentation">
                      <Button
                        variant="primary"
                        onClick={() => setSelectedVCs([vc])}
                        size="sm"
                      >
                        {t('create-presentation')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Tab.Panel>
              <Tab.Panel className="w-full">
                <JsonPanel credential={vc.data} />
                <div className="mt-8 flex flex-col md:flex-row">
                  <div className="flex-1" />
                  <div className="flex flex-1 justify-end">
                    <Link href="/app/create-verifiable-presentation">
                      <Button
                        variant="primary"
                        onClick={() => setSelectedVCs([vc])}
                        size="sm"
                      >
                        {t('create-presentation')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </div>
        </div>
      </Tab.Group>
      <DeleteModal
        isOpen={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        vc={vc}
      />
      <ModifyDSModal
        isOpen={modifyDSModalOpen}
        setOpen={setModifyDSModalOpen}
        vc={vc}
      />
    </>
  );
};

export default CredentialDisplay;
