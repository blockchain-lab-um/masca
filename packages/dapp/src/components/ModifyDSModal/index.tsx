import { Fragment } from 'react';
import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
import { Dialog, Transition } from '@headlessui/react';

import { useSnapStore } from '@/utils/stores';
import Button from '../Button';
import ToggleSwitch from '../Switch';

interface ModifyDSModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  vc: QueryVCsRequestResult;
}

function ModifyDSModal({ open, setOpen, vc }: ModifyDSModalProps) {
  const enabledStores = useSnapStore((state) => state.availableVCStores);
  const keys = Object.keys(enabledStores);
  const availableStores = keys.filter((key) => enabledStores[key] === true);

  const vcStores: Record<string, { enabled: boolean; saved: boolean }> = {};

  if (vc.metadata.store) {
    if (typeof vc.metadata.store === 'string') {
      if (availableStores.includes(vc.metadata.store)) {
        vcStores[vc.metadata.store] = { enabled: true, saved: true };
      } else {
        vcStores[vc.metadata.store] = { enabled: false, saved: true };
      }
    } else {
      vc.metadata.store.forEach((store) => {
        if (availableStores.includes(store)) {
          vcStores[store] = { enabled: true, saved: true };
        } else {
          vcStores[store] = { enabled: false, saved: true };
        }
      });
    }
  }

  availableStores.forEach((store) => {
    if (!vcStores[store]) {
      vcStores[store] = { enabled: true, saved: false };
    }
  });

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
                  <p className="text-sm text-red-500 my-2">
                    Feature not implemented yet.
                  </p>
                  <p className="text-sm text-gray-500">
                    Here you can define where the credential will be stored.
                  </p>
                </div>
                <div className="mt-6 text-gray-800">
                  {Object.keys(vcStores).map((store, id) => (
                    <div key={id} className="flex justify-between items-center">
                      <div>{store}</div>
                      <span
                        className={`${
                          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                          !vcStores[store].enabled && 'opacity-60'
                        }`}
                      >
                        <ToggleSwitch
                          enabled={vcStores[store].saved}
                          disabled={!vcStores[store].enabled}
                          setEnabled={(e) => {
                            // TODO update vc in snap (Save VC to new store/Remove VC from store) => update VCS on dApp
                            console.log(e);
                          }}
                          size="xs"
                        />
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end items-center">
                  <div className="mt-8">
                    <Button
                      onClick={() => setOpen(false)}
                      variant="gray"
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

export default ModifyDSModal;
