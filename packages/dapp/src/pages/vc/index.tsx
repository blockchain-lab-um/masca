import React, { Fragment, useState } from 'react';
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
import { useTranslations } from 'next-intl';

import ConnectedProvider from '@/components/ConnectedProvider';
import FormatedTab from '@/components/VC/tabs/FormatedTab';
import JsonTab from '@/components/VC/tabs/JsonTab';
import { useSnapStore } from '@/stores';

const VC = () => {
  const t = useTranslations('VC');
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
        <div className="flex h-full min-h-[50vh] justify-center rounded-3xl bg-white p-5 shadow-lg dark:bg-gray-800 dark:shadow-orange-900">
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
        <title>Masca | VC</title>
        <meta name="description" content="VC page for Masca." />
      </Head>
      <div className="grid place-items-center">
        <div className="w-full max-w-sm md:max-w-xl lg:max-w-2xl xl:w-[50rem] xl:max-w-[50rem]">
          <Tab.Group>
            <div className="flex items-center justify-between">
              <Tab.List className="h-19 dark:bg-navy-blue-700 relative flex w-36 flex-shrink-0 justify-between rounded-full bg-white shadow-md">
                <Tab>
                  {({ selected }) => (
                    <div className="relative">
                      <div
                        className={`transition-width dark:bg-orange-accent-dark h-10 rounded-full bg-pink-100 ease-in-out ${
                          selected
                            ? 'w-20 translate-x-0'
                            : ' w-16 translate-x-20'
                        }`}
                      ></div>
                      <span
                        className={`absolute left-0 top-2 z-20  ${
                          selected
                            ? ' dark:text-navy-blue-900 text-pink-600'
                            : ' dark:text-navy-blue-300 dark:hover:text-navy-blue-200 text-gray-700 hover:text-gray-500'
                        }  animated-transition ml-3.5 rounded-full`}
                      >
                        Normal
                      </span>
                    </div>
                  )}
                </Tab>
                <Tab
                  className={({ selected }) =>
                    `z-20  ${
                      selected
                        ? ' dark:text-navy-blue-900 text-pink-600'
                        : ' dark:text-navy-blue-300 dark:hover:text-navy-blue-200 text-gray-700 hover:text-gray-500'
                    }  animated-transition mr-3 rounded-full`
                  }
                >
                  JSON
                </Tab>
              </Tab.List>
              <div className="flex gap-1">
                <button
                  className={`dark:bg-navy-blue-700 dark:text-navy-blue-50 flex h-[43px] w-[43px] items-center justify-center rounded-full bg-white text-gray-700 shadow-md`}
                  onClick={() => setModifyDSModalOpen(true)}
                >
                  <Cog6ToothIcon className="h-6 w-6" />
                </button>
                <button
                  className={`dark:bg-navy-blue-700 dark:text-navy-blue-50 flex h-[43px] w-[43px] items-center justify-center rounded-full bg-white text-gray-700 shadow-md`}
                  onClick={() => console.log('not implemented yet')}
                >
                  <ArrowDownTrayIcon className="h-6 w-6" />
                </button>
                <button
                  className={`dark:bg-navy-blue-700 dark:text-navy-blue-50 flex h-[43px] w-[43px] items-center justify-center rounded-full bg-white text-gray-700 shadow-md`}
                  onClick={() => console.log('not implemented yet')}
                >
                  <ShareIcon className="h-6 w-6 " />
                </button>
                <button
                  className={`dark:bg-navy-blue-700 dark:text-navy-blue-50 flex h-[43px] w-[43px] items-center justify-center rounded-full bg-white text-gray-700 shadow-md`}
                  onClick={() => setDeleteModalOpen(true)}
                >
                  <TrashIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="dark:bg-navy-blue-800 mt-4 h-full w-full rounded-3xl bg-white py-2 shadow-lg">
              <ConnectedProvider>
                <div className="flex w-full items-center justify-between px-8 pt-4">
                  <button
                    onClick={() => router.back()}
                    className="animated-transition dark:text-navy-blue-50 dark:hover:bg-navy-blue-700 rounded-full p-1 text-gray-900 hover:bg-pink-100 hover:text-pink-700"
                  >
                    <ArrowLeftIcon className="h-6 w-6" />
                  </button>
                  <div className="text-h4 dark:text-navy-blue-50 font-semibold text-gray-900">
                    {t('vc')}
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
                      <JsonTab
                        vc={vc}
                        deleteModalOpen={deleteModalOpen}
                        setDeleteModalOpen={setDeleteModalOpen}
                        modifyDSModalOpen={modifyDSModalOpen}
                        setModifyDSModalOpen={setModifyDSModalOpen}
                      />
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

export async function getStaticProps(context: { locale: any }) {
  return {
    props: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
      messages: (await import(`../../locales/${context.locale}.json`)).default,
    },
  };
}
