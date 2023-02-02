import Link from 'next/link';
import React from 'react';
import ConnectedGateway from 'src/components/ConnectedGateway';
import MetaMaskGateway from 'src/components/MetaMaskGateway';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { TrashIcon, ShareIcon } from '@heroicons/react/24/outline';
import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import useUrlQuery from '../../hooks/useUrlQuery';
import { useGeneralStore, useSnapStore } from '../../utils/store';
import { QRTab, JsonTab, FormatedTab } from './tabs';

function classNames(...classes: string[]) {
  return clsx(classes);
}

export const VC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const { id } = useUrlQuery();
  const vcs = useSnapStore((state) => state.vcs);
  const vc = vcs.find((VCobj) => VCobj.metadata.id === id);

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
      <div className="h-full min-h-[80vh] bg-white border border-gray-200 pt-2 dark:bg-gray-800 dark:shadow-orange-900  rounded-3xl shadow-lg">
        <ConnectedGateway>
          <div className="flex flex-col items-center">
            <div className="w-full grid grid-cols-3 px-5 py-2 border-b">
              <Link href="dashboard">
                <button className="text-orange-500 hover:bg-orange-100 p-1 hover:text-orange-700 animated-transition rounded-full">
                  <ArrowLeftIcon className="w-6 h-6" />
                </button>
              </Link>
              <div className="text-h3 text-center">Verifiable Credential</div>
              <div className="text-end">
                <button className="text-gray-800 hover:bg-orange-100 p-1 hover:text-orange-700 animated-transition rounded-full">
                  <ShareIcon className="w-6 h-6" />
                </button>
                <button className="text-gray-800 hover:bg-orange-100 p-1 hover:text-orange-700 animated-transition rounded-full">
                  <TrashIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="w-full px-2 sm:px-0">
              <Tab.Group>
                <center>
                  <Tab.List className="flex max-w-md space-x-1 rounded-xl bg-orange-900/20 p-1">
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          'w-full rounded-lg py-2.5 text-sm font-semibold leading-5 text-orange-500 animated-transition',
                          selected
                            ? 'bg-white shadow-sm'
                            : 'text-orange-900 hover:bg-orange-100 hover:text-orange-700'
                        )
                      }
                    >
                      Normal
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          'w-full rounded-lg py-2.5 text-sm font-semibold leading-5 text-orange-500 animated-transition',
                          selected
                            ? 'bg-white shadow-sm'
                            : 'text-orange-900 hover:bg-orange-100 hover:text-orange-700'
                        )
                      }
                    >
                      JSON
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          'w-full rounded-lg py-2.5 text-sm font-semibold leading-5 text-orange-500 animated-transition',
                          selected
                            ? 'bg-white shadow-sm'
                            : 'text-orange-900 hover:bg-orange-100 hover:text-orange-700'
                        )
                      }
                    >
                      QR
                    </Tab>
                  </Tab.List>
                </center>
                <Tab.Panels>
                  <Tab.Panel>
                    <FormatedTab vc={vc} />
                  </Tab.Panel>
                  <Tab.Panel>
                    <JsonTab vc={vc} />
                  </Tab.Panel>
                  <Tab.Panel>
                    <QRTab vc={vc} />
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </div>
        </ConnectedGateway>
      </div>
    </MetaMaskGateway>
  );
};
