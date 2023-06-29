import { isError } from '@blockchain-lab-um/utils';
import { Tab } from '@headlessui/react';
import { VerifiableCredential } from '@veramo/core';
import clsx from 'clsx';

import Button from '@/components/Button';
import FormatedPanel from '@/components/CredentialDisplay/FormatedPanel';
import JsonPanel from '@/components/CredentialDisplay/JsonPanel';
import Modal from '@/components/Modal';
import { useMascaStore, useToastStore } from '@/stores';

type CredentialModalProps = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  credential: VerifiableCredential;
};

const CredentialModal = ({
  isOpen,
  setOpen,
  credential,
}: CredentialModalProps) => {
  const mascaApi = useMascaStore((state) => state.mascaApi);

  const handleSaveCredential = async () => {
    if (!mascaApi) return;
    setOpen(false);

    useToastStore.setState({
      open: true,
      text: 'Saving credential.',
      type: 'normal',
      loading: true,
    });

    const saveCredentialResult = await mascaApi.saveVC(credential);

    useToastStore.setState({
      open: false,
    });

    if (isError(saveCredentialResult)) {
      useToastStore.setState({
        open: true,
        text: 'Error saving credential.',
        type: 'error',
        loading: false,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
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
        <Tab.Panels className="w-[48rem] max-w-full">
          <Tab.Panel>
            <FormatedPanel credential={credential} />
          </Tab.Panel>
          <Tab.Panel>
            <JsonPanel credential={credential} />
          </Tab.Panel>
        </Tab.Panels>
        <div className="mt-8 flex justify-end">
          <Button variant="cancel" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => handleSaveCredential()}>
            Save credential
          </Button>
        </div>
      </Tab.Group>
    </Modal>
  );
};
export default CredentialModal;
