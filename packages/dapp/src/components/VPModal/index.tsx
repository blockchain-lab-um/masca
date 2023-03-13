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
          <div className="fixed inset-0 bg-black bg-opacity-25" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all md:max-w-xl lg:max-w-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold leading-6 text-orange-500"
                >
                  Verifiable Presentation
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Here is a presentation consisting of selected credentials.
                  </p>
                </div>
                <div className="mt-8">
                  <div className="group relative z-0 rounded-2xl bg-orange-100 pt-1 pr-2">
                    <textarea
                      className="group-hover:scrollbar-thumb-orange-300 scrollbar-thin scrollbar-thumb-orange-300/0 scrollbar-thumb-rounded-full font-jetbrains-mono min-h-[60vh] w-full resize-none rounded-2xl bg-orange-100 p-2 text-orange-900 focus:outline-none "
                      disabled
                      value={JSON.stringify(vp, null, 4)}
                    />

                    <button
                      onClick={() => {
                        navigator.clipboard
                          .writeText(JSON.stringify(vp, null, 4))
                          .catch(() => {});
                      }}
                      className="animated-transition absolute bottom-3 right-6 rounded-full border border-gray-200 bg-orange-300 p-1 text-orange-900 shadow-md hover:bg-orange-200 hover:text-orange-800"
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
                      size="popup"
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
