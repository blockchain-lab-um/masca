import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
import { useSnapStore } from 'src/utils/store';
import ToggleSwitch from '../Switch';

interface ModifyDSModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  vc: QueryVCsRequestResult;
}

export function ModifyDSModal({ open, setOpen, vc }: ModifyDSModalProps) {
  const availableStores = useSnapStore((state) => state.availableVCStores);
  const vcStores: Record<string, boolean> = {};
  availableStores.forEach((store) => {
    vcStores[store] = false;
  });
  if (vc.metadata.store) {
    if (typeof vc.metadata.store === 'string') {
      vcStores[vc.metadata.store] = true;
    } else {
      vc.metadata.store.forEach((store) => {
        vcStores[store] = true;
      });
    }
  }

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
                  className="text-lg font-medium leading-6 text-gray-800"
                >
                  Modify Credential
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Here you can define where the credential will be stored.
                  </p>
                </div>
                <div className="mt-6 text-gray-800">
                  {availableStores.map((store, id) => (
                    <div key={id} className="flex justify-between items-center">
                      <div>{store}</div>
                      <ToggleSwitch
                        enabled={vcStores[store]}
                        setEnabled={(e) => {
                          // TODO update vc in snap (Save VC to new store/Remove VC from store) => update VCS on dApp
                          console.log(e);
                        }}
                        size="xs"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end items-center">
                  <div className="mt-4">
                    <button
                      type="button"
                      className="bg-white animated-transition text-gray-700 inline-flex justify-center rounded-full border border-transparent px-3.5 py-1.5 text-sm font-semibold focus:outline-none focus-visible:ring-2 "
                      onClick={() => setOpen(false)}
                    >
                      Done
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
