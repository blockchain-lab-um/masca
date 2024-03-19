import { isError } from '@blockchain-lab-um/masca-connector';
import { Tab } from '@headlessui/react';
import { VerifiableCredential } from '@veramo/core';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React from 'react';

import Button from '@/components/Button';
import FormattedPanel from '@/components/CredentialDisplay/FormattedPanel';
import JsonPanel from '@/components/CredentialDisplay/JsonPanel';
import {
  useEncryptedSessionStore,
  useMascaStore,
  useToastStore,
} from '@/stores';

interface CredentialViewProps {
  credential: VerifiableCredential;
  scanNewCode: () => void;
}

export const CredentialView = ({
  credential,
  scanNewCode,
}: CredentialViewProps) => {
  const t = useTranslations('CredentialView');
  const changeRequest = useEncryptedSessionStore(
    (state) => state.changeRequest
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
        title: t('saving'),
        type: 'normal',
        loading: true,
        link: null,
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
          title: t('saving-error'),
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
        title: t('saving-success'),
        type: 'success',
        loading: false,
        link: null,
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
                  />
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
        <Tab.Panels>
          <Tab.Panel>
            <FormattedPanel credential={credential} />
          </Tab.Panel>
          <Tab.Panel>
            <JsonPanel data={credential} />
          </Tab.Panel>
        </Tab.Panels>
        <div className="mt-8 flex justify-end">
          <Button variant="cancel" onClick={() => onScanNewCode()}>
            {t('cancel')}
          </Button>
          <Button variant="primary" onClick={() => handleSaveCredential()}>
            {t('save')}
          </Button>
        </div>
      </Tab.Group>
    </div>
  );
};
