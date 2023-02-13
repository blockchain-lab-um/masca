import React, { useState } from 'react';
import ConnectedGateway from 'src/components/ConnectedGateway';
import MetaMaskGateway from 'src/components/MetaMaskGateway';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { Tab } from '@headlessui/react';
import {
  DocumentDuplicateIcon,
  ShareIcon,
  TrashIcon,
  Cog6ToothIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import Button from 'src/components/Button';
import useUrlQuery from '../../hooks/useUrlQuery';
import { useSnapStore } from '../../utils/store';
import { JsonTab, FormatedTab } from './tabs';

function classNames(...classes: string[]) {
  return clsx(classes);
}

export const VC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const router = useRouter();
  const { id } = useUrlQuery();
  const vcs = useSnapStore((state) => state.vcs);
  const vc = vcs.find((VCobj) => VCobj.metadata.id === id);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modifyDSModalOpen, setModifyDSModalOpen] = useState(false);

  if (!vc) {
    return (
      <MetaMaskGateway>
        <div className="flex justify-center h-full min-h-[50vh] p-5 bg-white dark:bg-gray-800 dark:shadow-orange-900  rounded-3xl shadow-lg">
          <ConnectedGateway>
            <div className="flex flex-col">VC not found!</div>
          </ConnectedGateway>
        </div>
      </MetaMaskGateway>
    );
  }

  return (
    <MetaMaskGateway>
      <div className="grid place-items-center">
        <div className="max-w-sm md:max-w-xl lg:max-w-2xl xl:max-w-[50rem] xl:w-[50rem] w-full">
          <Tab.Group>
            <div className="flex justify-between items-center">
              <Tab.List className="flex max-w-fit space-x-1 rounded-full mb-2 text-orange-900 bg-white p-1 shadow-md border border-gray-200">
                <Tab
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-full text-sm py-2 font-semibold px-4 text-orange-500 animated-transition',
                      selected
                        ? 'bg-orange-100'
                        : 'text-orange-900 hover:bg-orange-100 hover:text-orange-700'
                    )
                  }
                >
                  Normal
                </Tab>
                <Tab
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-full text-sm py-2 font-semibold px-4 text-orange-500 animated-transition',
                      selected
                        ? 'bg-orange-100'
                        : 'text-orange-900 hover:bg-orange-100 hover:text-orange-700'
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
                  <Cog6ToothIcon className="w-5 h-5" />
                </Button>
                <Button variant="white" size="icon" shadow="md">
                  <ArrowDownTrayIcon className="w-5 h-5" />
                </Button>
                <Button
                  variant="white"
                  size="icon"
                  shadow="md"
                  onClick={() => setDeleteModalOpen(true)}
                >
                  <ShareIcon className="w-5 h-5" />
                </Button>
                <Button
                  variant="white"
                  size="icon"
                  shadow="md"
                  onClick={() => setDeleteModalOpen(true)}
                >
                  <TrashIcon className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="h-full w-full bg-white border border-gray-200 pt-2 dark:bg-gray-800 dark:shadow-orange-900 rounded-3xl shadow-lg">
              <ConnectedGateway>
                <div className="w-full flex justify-between px-5 pt-4">
                  <button
                    onClick={() => router.back()}
                    className="text-gray-900 hover:bg-orange-100 p-1 hover:text-orange-700 animated-transition rounded-full"
                  >
                    <ArrowLeftIcon className="w-6 h-6" />
                  </button>
                  <div className="text-h3 font-semibold">
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
              </ConnectedGateway>
            </div>
          </Tab.Group>
        </div>
      </div>
    </MetaMaskGateway>
  );
};
