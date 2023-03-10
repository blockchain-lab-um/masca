import { Fragment } from 'react';
import {
  AvailableVCStores,
  QueryVCsRequestResult,
} from '@blockchain-lab-um/ssi-snap-types';
import { Dialog, Transition } from '@headlessui/react';
import { shallow } from 'zustand/shallow';

import Button from '@/components/Button';
import { useSnapStore, useToastStore } from '@/utils/stores';

interface DeleteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  vc?: QueryVCsRequestResult;
}

function DeleteModal({ open, setOpen, vc }: DeleteModalProps) {
  const api = useSnapStore((state) => state.snapApi);
  const { setTitle, setLoading, setToastOpen } = useToastStore(
    (state) => ({
      setTitle: state.setTitle,
      setText: state.setText,
      setLoading: state.setLoading,
      setToastOpen: state.setOpen,
    }),
    shallow
  );

  const deleteVC = async () => {
    setOpen(false);
    if (vc) {
      setLoading(true);
      setTitle('Deleting Credential');
      setToastOpen(true);
      setOpen(false);
      let deleteReqOptions;
      if (vc.metadata.store)
        deleteReqOptions = {
          store: vc.metadata.store as AvailableVCStores | AvailableVCStores[],
        };
      await api?.deleteVC(vc.metadata.id, deleteReqOptions);
      // TODO - Delete VC from local state instead of calling queryVCs.
      const vcs = await api?.queryVCs();
      if (vcs) {
        setToastOpen(false);
        setTimeout(() => {
          setTitle('Credential deleted');
          setLoading(false);
          setToastOpen(true);
        }, 100);
        // useSnapStore.getState().changeVcs(vcs);
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
                  className="text-lg font-semibold leading-6 text-red-500"
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
                    <Button
                      onClick={() => setOpen(false)}
                      variant="gray"
                      size="popup"
                    >
                      Cancel
                    </Button>
                  </div>
                  <div className="mt-4 ml-2">
                    <Button
                      onClick={() => deleteVC()}
                      variant="warning"
                      size="popup"
                    >
                      Delete VC
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

export default DeleteModal;
