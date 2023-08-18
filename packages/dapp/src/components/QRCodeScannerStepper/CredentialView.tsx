import React from 'react';
import { isError } from '@blockchain-lab-um/masca-connector';
import { Tab } from '@headlessui/react';
import { VerifiableCredential } from '@veramo/core';
import clsx from 'clsx';

import { useMascaStore, useSessionStore, useToastStore } from '@/stores';
import Button from '../Button';
import FormatedPanel from '../CredentialDisplay/FormatedPanel';
import JsonPanel from '../CredentialDisplay/JsonPanel';

interface CredentialViewProps {
  credential: VerifiableCredential;
  scanNewCode: () => void;
}

export const CredentialView = ({
  credential,
  scanNewCode,
}: CredentialViewProps) => {
  const { request, session, changeRequest, changeSession } = useSessionStore(
    (state) => ({
      request: state.request,
      session: state.session,
      changeRequest: state.changeRequest,
      changeSession: state.changeSession,
    })
  );

  const mascaApi = useMascaStore((state) => state.mascaApi);

  const onScanNewCode = () => {
    changeRequest({
      active: false,
      data: null,
      type: null,
      finished: false,
    });
    scanNewCode();
  };

  const handleSaveCredential = async () => {
    if (!mascaApi) return;

    setTimeout(() => {
      useToastStore.setState({
        open: true,
        text: 'Saving',
        type: 'normal',
        loading: true,
      });
    }, 200);

    const saveCredentialResult = await mascaApi.saveCredential(credential);

    useToastStore.setState({
      open: false,
    });

    if (isError(saveCredentialResult)) {
      console.log(saveCredentialResult.error);
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          text: 'Error while saving',
          type: 'error',
          loading: false,
        });
      }, 200);
      return;
    }

    setTimeout(() => {
      useToastStore.setState({
        open: true,
        text: 'Successfully saved',
        type: 'success',
        loading: false,
      });
    }, 200);

    onScanNewCode();
  };

  return (
    <div>
      <Tab.Group>
        <Tab.List>
          <div className="dark:bg-navy-blue-700 relative mb-4 flex w-36 shrink-0 justify-between rounded-full bg-white">
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
          </div>
        </Tab.List>
        <Tab.Panels className="">
          <Tab.Panel>
            <FormatedPanel credential={credential} />
          </Tab.Panel>
          <Tab.Panel>
            <JsonPanel credential={credential} />
          </Tab.Panel>
        </Tab.Panels>
        <div className="mt-8 flex justify-end">
          <Button variant="cancel" onClick={() => onScanNewCode()}>
            {'Cancel'}
          </Button>
          <Button variant="primary" onClick={() => handleSaveCredential()}>
            {'Save'}
          </Button>
        </div>
      </Tab.Group>
    </div>
  );
};
