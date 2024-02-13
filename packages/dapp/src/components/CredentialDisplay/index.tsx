'use client';

import { useState } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import {
  ArrowDownTrayIcon,
  ArrowLeftIcon,
  Cog6ToothIcon,
  ShareIcon,
  TrashIcon,
} from '@heroicons/react/20/solid';
import { Tab, Tabs, Tooltip } from '@nextui-org/react';
import { useTranslations } from 'next-intl';

import { removeCredentialSubjectFilterString } from '@/utils/format';
import { useMascaStore, useTableStore } from '@/stores';
import Button from '../Button';
import DeleteModal from '../DeleteModal';
import ModifyDSModal from '../ModifyDSModal';
import StoreIcon from '../StoreIcon';
import FormatedPanel from './FormatedPanel';
import JsonPanel from './JsonPanel';

interface CredentialDisplayProps {
  id: string;
}

const CredentialDisplay = ({ id }: CredentialDisplayProps) => {
  const t = useTranslations('CredentialDisplay');
  const router = useRouter();
  const vcs = useMascaStore((state) => state.vcs);
  const setSelectedCredentials = useTableStore(
    (state) => state.setSelectedCredentials
  );

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modifyDSModalOpen, setModifyDSModalOpen] = useState(false);

  const vcWithFilterString = vcs.find((vcObj) => vcObj.metadata.id === id);
  const vc = vcWithFilterString
    ? removeCredentialSubjectFilterString(vcWithFilterString)
    : null;

  const [selectedTab, setSelectedTab] = useState<'Normal' | 'Json'>('Normal');

  if (!vc) {
    return notFound();
  }

  return (
    <>
      <div className="flex justify-between">
        <Tabs
          onSelectionChange={(key) => setSelectedTab(key as 'Normal' | 'Json')}
          radius="lg"
          size="lg"
          classNames={{
            cursor: 'dark:bg-orange-accent-dark bg-pink-200',
            tabList: 'bg-white dark:bg-navy-blue-800',
            tabContent:
              'dark:text-navy-blue-300 dark:hover:text-navy-blue-200 text-gray-700 hover:text-gray-500 dark:group-data-[selected=true]:text-navy-blue-900 group-data-[selected=true]:text-gray-800',
          }}
        >
          <Tab key="Normal" title="Normal" />
          <Tab key="Json" title="JSON" />
        </Tabs>
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
            className="animated-transition dark:text-navy-blue-50 dark:hover:bg-navy-blue-700 rounded-full p-1 text-gray-800 hover:bg-pink-100 hover:text-pink-700"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <div className="text-h4 dark:text-navy-blue-50 font-semibold text-gray-800">
            {t('title')}
          </div>
        </div>
        {selectedTab === 'Normal' && (
          <>
            <FormatedPanel credential={vc.data} />
            <div className="mt-8 flex flex-col space-y-2 px-6">
              <h1 className="text-md dark:text-orange-accent-dark font-medium text-pink-500">
                {t('datastores')}
              </h1>
              {vc.metadata.store && (
                <div className="flex gap-x-1">
                  {vc.metadata.store.map((store) => (
                    <Tooltip
                      content={store}
                      key={store}
                      className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
                    >
                      <div className="relative">
                        <StoreIcon store={store} />
                      </div>
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
                    onClick={() => setSelectedCredentials([vc])}
                    size="sm"
                  >
                    {t('create-presentation')}
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
        {selectedTab === 'Json' && (
          <>
            <JsonPanel data={vc.data} />
            <div className="mt-8 flex flex-col md:flex-row">
              <div className="flex-1" />
              <div className="flex flex-1 justify-end">
                <Link href="/app/create-verifiable-presentation">
                  <Button
                    variant="primary"
                    onClick={() => setSelectedCredentials([vc])}
                    size="sm"
                  >
                    {t('create-presentation')}
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
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
