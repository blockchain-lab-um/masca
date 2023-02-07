import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';

interface DeleteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  vc?: QueryVCsRequestResult;
}

export function DeleteModal({ open, setOpen, vc }: DeleteModalProps) {
  console.log(vc);
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-red-500"
                >
                  Delete Credential
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Approving this action will remove the credential from your
                    wallet. This action cannot be undone.
                  </p>
                </div>
                <div className="flex justify-end items-center">
                  <div className="mt-4">
                    <button
                      type="button"
                      className="bg-white animated-transition text-gray-700 inline-flex justify-center rounded-full border border-transparent px-3.5 py-1.5 text-sm font-semibold focus:outline-none focus-visible:ring-2 "
                      onClick={() => setOpen(false)}
                    >
                      Cancle
                    </button>
                  </div>
                  <div className="mt-4 ml-2">
                    <button
                      type="button"
                      className="bg-red-500 hover:bg-red-500/90 animated-transition text-white inline-flex justify-center rounded-full border border-transparent px-4 py-2 text-sm font-semibold focus:outline-none focus-visible:ring-2 "
                      onClick={() => setOpen(false)}
                    >
                      Delete
                    </button>
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
