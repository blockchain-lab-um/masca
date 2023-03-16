import { Fragment, useState } from 'react';
import {
  AvailableVCStores,
  QueryVCsRequestResult,
} from '@blockchain-lab-um/ssi-snap-types';
import { isError } from '@blockchain-lab-um/utils';
import { Dialog, Transition } from '@headlessui/react';
import { shallow } from 'zustand/shallow';

import { useSnapStore, useToastStore } from '@/utils/stores';
import Button from '../Button';
import DeleteModal from '../DeleteModal';
import ToggleSwitch from '../Switch';

interface ModifyDSModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  vc: QueryVCsRequestResult;
}

function ModifyDSModal({ open, setOpen, vc }: ModifyDSModalProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { setTitle, setLoading, setToastOpen } = useToastStore(
    (state) => ({
      setTitle: state.setTitle,
      setText: state.setText,
      setLoading: state.setLoading,
      setToastOpen: state.setOpen,
    }),
    shallow
  );
  const [deleteModalStore, setDeleteModalStore] = useState<
    AvailableVCStores | undefined
  >(undefined);
  const { enabledStores, snapApi } = useSnapStore(
    (state) => ({
      enabledStores: state.availableVCStores,
      snapApi: state.snapApi,
    }),
    shallow
  );
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

  const handleDSChange = async (store: AvailableVCStores, enabled: boolean) => {
    if (!snapApi) return;
    if (!enabled) {
      setDeleteModalStore(store);
      setDeleteModalOpen(true);
    } else if (enabled) {
      setLoading(true);
      setTitle('Saving Credential');
      setToastOpen(true);
      setOpen(false);
      const res = await snapApi.saveVC(vc.data, { store });
      if (isError(res)) {
        setToastOpen(false);
        setTimeout(() => {
          setTitle('Error while saving credential');
          setLoading(false);
          setToastOpen(true);
        }, 100);
        console.log(res.error);
      } else {
        setToastOpen(false);
        setTimeout(() => {
          setTitle('Credential saved');
          setLoading(false);
          setToastOpen(true);
        }, 100);
        const vcs = await snapApi.queryVCs();
        if (isError(vcs)) {
          console.log(vcs.error);
        } else {
          useSnapStore.getState().changeVcs(vcs.data);
        }
      }
    }
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
                  className="font-ubuntu dark:text-navy-blue-50 text-xl font-medium leading-6 text-gray-900"
                >
                  Modify Credential
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-md dark:text-navy-blue-200 text-gray-500">
                    Here you can define where the credential will be stored.
                  </p>
                </div>
                <div className="dark:text-navy-blue-100 mt-10 px-4 text-gray-700">
                  {Object.keys(vcStores).map((store, id) => (
                    <div
                      key={id}
                      className="mt-3 flex items-center justify-between"
                    >
                      <div>{store}</div>
                      <span
                        className={`${
                          !vcStores[store].enabled ? 'opacity-60' : ''
                        }`}
                      >
                        <ToggleSwitch
                          enabled={vcStores[store].saved}
                          disabled={!vcStores[store].enabled}
                          setEnabled={(e) => {
                            handleDSChange(store as AvailableVCStores, e)
                              .then(() => {})
                              .catch(() => {});
                          }}
                          size="sm"
                        />
                      </span>
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
                      Done
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
          <DeleteModal
            open={deleteModalOpen}
            setOpen={setDeleteModalOpen}
            vc={vc}
            store={deleteModalStore}
          />
        </div>
      </Dialog>
    </Transition>
  );
}

export default ModifyDSModal;
