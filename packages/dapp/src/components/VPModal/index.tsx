import { Fragment } from 'react';
import { useRouter } from 'next/router';
import { Dialog, Transition } from '@headlessui/react';
import { DocumentDuplicateIcon } from '@heroicons/react/24/solid';
import { W3CVerifiablePresentation } from '@veramo/core';

import Button from '@/components/Button';

interface VPModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  vp: W3CVerifiablePresentation;
}

function VPModal({ open, setOpen, vp }: VPModalProps) {
  const router = useRouter();
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
              <Dialog.Panel className="dark:bg-navy-blue-500 w-full max-w-md transform overflow-hidden rounded-2xl bg-orange-50 p-6 text-left align-middle shadow-xl transition-all md:max-w-xl lg:max-w-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-h3 font-ubuntu dark:text-navy-blue-50 font-medium leading-6  text-gray-900"
                >
                  Verifiable Presentation
                </Dialog.Title>
                <div className="mt-5">
                  <p className="text-md dark:text-navy-blue-200 text-gray-600">
                    Here is a presentation consisting of selected credentials.
                  </p>
                </div>
                <div className="mt-5">
                  <div className="dark:bg-navy-blue-300 dark:border-navy-blue-400 group relative z-0 rounded-2xl border border-gray-200 bg-gray-50 pt-1 pr-2">
                    <textarea
                      className="group-hover:scrollbar-thumb-orange-300 dark:text-navy-blue-800 dark:bg-navy-blue-300 scrollbar-thin scrollbar-thumb-orange-300/0 scrollbar-thumb-rounded-full font-jetbrains-mono min-h-[60vh] w-full resize-none rounded-2xl bg-gray-50 p-2 text-gray-700 focus:outline-none"
                      disabled
                      value={JSON.stringify(vp, null, 4)}
                    />

                    <button
                      onClick={() => {
                        navigator.clipboard
                          .writeText(JSON.stringify(vp, null, 4))
                          .catch(() => {});
                      }}
                      className="animated-transition absolute bottom-3 right-6 rounded-full bg-gray-500 p-1 text-gray-900 shadow-md hover:bg-gray-400 hover:text-gray-700"
                    >
                      <DocumentDuplicateIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-end">
                  <div className="mt-4 ml-2">
                    <Button
                      onClick={async () => {
                        setOpen(false);
                        await router.push('/dashboard');
                      }}
                      variant="primary"
                      size="sm"
                    >
                      Done
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

export default VPModal;
