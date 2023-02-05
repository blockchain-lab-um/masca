import Link from 'next/link';
import React from 'react';
import ConnectedGateway from 'src/components/ConnectedGateway';
import MetaMaskGateway from 'src/components/MetaMaskGateway';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import useUrlQuery from '../../hooks/useUrlQuery';
import { useGeneralStore, useSnapStore } from '../../utils/store';
import { JsonTab, FormatedTab } from './tabs';

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
      <div className="grid place-items-center">
        <div className="max-w-sm md:max-w-md lg:max-w-lg xl:max-w-[34rem] xl:w-[34rem] w-full">
          <Tab.Group>
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
            <div className="h-full w-full bg-white border border-gray-200 pt-2 dark:bg-gray-800 dark:shadow-orange-900 rounded-3xl shadow-lg">
              <ConnectedGateway>
                <div className="w-full flex justify-between px-5 pt-4">
                  <Link href="dashboard">
                    <button className="text-gray-900 hover:bg-orange-100 p-1 hover:text-orange-700 animated-transition rounded-full">
                      <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                  </Link>
                  <div className="text-h3 font-semibold">
                    Verifiable Credential
                  </div>
                </div>
                <div className="w-full px-2 sm:px-0">
                  <Tab.Panels className="w-full">
                    <Tab.Panel>
                      <FormatedTab vc={vc} />
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
