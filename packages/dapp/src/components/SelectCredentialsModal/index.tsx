import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import type { VerifiableCredential } from '@veramo/core';
import { useTranslations } from 'next-intl';

import Button from '@/components/Button';

interface SelectCredentialsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  credentials: VerifiableCredential[];
  selectCredentials: (credentials: VerifiableCredential[]) => void;
}

function SelectCredentialsModal({
  open,
  setOpen,
  credentials,
  selectCredentials,
}: SelectCredentialsModalProps) {
  const t = useTranslations('SelectCredentialsModal');
  const [selectedCredentials, setSelectedCredentials] = useState<
    VerifiableCredential[]
  >([]);

  const handleConfirm = () => {
    selectCredentials(selectedCredentials);
    setOpen(false);
  };

  const handleSelectionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    credential: VerifiableCredential
  ) => {
    if (e.target.checked) {
      setSelectedCredentials([...selectedCredentials, credential]);
      return;
    }

    setSelectedCredentials(
      selectedCredentials.filter((c) => c.id !== credential.id)
    );
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 dark:bg-opacity-60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="dark:bg-navy-blue-500 w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="font-ubuntu dark:text-navy-blue-50 text-xl font-medium leading-6 text-gray-900 "
                >
                  {t('title')}
                </Dialog.Title>
                <div className="mt-4">
                  <p className="text-md dark:text-navy-blue-200 text-gray-500 ">
                    {t('desc')}
                  </p>
                  {credentials.map((credential, index) => (
                    <div
                      key={index}
                      className="mt-4 flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          onChange={(e) => handleSelectionChange(e, credential)}
                        />
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="comments"
                            className="dark:text-navy-blue-50 font-medium text-gray-700"
                          >
                            {credential.name}
                          </label>
                          <p className="dark:text-navy-blue-200 space-x-1 text-gray-500">
                            {(credential.type as string[]).map((type) => (
                              <span key={type}>{type},</span>
                            ))}
                          </p>
                          <p className="dark:text-navy-blue-200 text-gray-500">
                            {credential.issuanceDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-end">
                  <div className="mt-10">
                    <Button
                      onClick={() => setOpen(false)}
                      variant="gray"
                      size="xs"
                    >
                      {t('cancel')}
                    </Button>
                  </div>
                  <div className="ml-2 mt-10">
                    <Button onClick={handleConfirm} variant="warning" size="xs">
                      {t('confirm')}
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default SelectCredentialsModal;
