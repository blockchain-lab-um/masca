import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { W3CVerifiablePresentation } from '@veramo/core';
import { useSnapStore } from 'src/utils/store';
import { DocumentDuplicateIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import Button from '../Button';
import DropdownMultiselect from '../DropdownMultiselect';
import InfoIcon from '../InfoIcon';

interface VPModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  vp: W3CVerifiablePresentation;
}

export function VPModal({ open, setOpen, vp }: VPModalProps) {
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
              <Dialog.Panel className="w-full max-w-md md:max-w-xl lg:max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
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
                  <div className="relative z-0 group bg-orange-100 pt-1 pr-2 rounded-2xl">
                    <textarea
                      className="group-hover:scrollbar-thumb-orange-300 scrollbar-thin rounded-2xl scrollbar-thumb-orange-300/0 scrollbar-thumb-rounded-full bg-orange-100 min-h-[60vh] w-full resize-none focus:outline-none p-2 text-orange-900 font-jetbrains "
                      disabled
                      value={JSON.stringify(vp, null, 4)}
                    />

                    <button
                      onClick={() => {
                        navigator.clipboard
                          .writeText(JSON.stringify(vp, null, 4))
                          .catch(() => {});
                      }}
                      className="absolute bottom-3 right-6 text-orange-900 p-1 rounded-full bg-orange-300 hover:bg-orange-200 hover:text-orange-800 shadow-md border border-gray-200 animated-transition"
                    >
                      <DocumentDuplicateIcon className="w-5 h-5" />
                    </button>
                  </div>
                  {/* <textarea
                    value={JSON.stringify(vp, null, 2)}
                    className="bg-gray-100 rounded-2xl border-gray-200 shadow-md border font-jetbrains text-label p-3 w-full focus:outline-none h-[45vh]"
                    readOnly
                  /> */}
                </div>
                <div className="mt-8 flex justify-end items-center">
                  <div className="mt-4 ml-2">
                    <Button
                      onClick={() => {
                        setOpen(false);
                        // eslint-disable-next-line @typescript-eslint/no-floating-promises
                        router.push('/dashboard');
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
