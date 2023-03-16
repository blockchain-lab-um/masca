import { Fragment } from 'react';
import {
  AvailableVCStores,
  QueryVCsRequestResult,
} from '@blockchain-lab-um/ssi-snap-types';
import { isError } from '@blockchain-lab-um/utils';
import { Dialog, Transition } from '@headlessui/react';
import { shallow } from 'zustand/shallow';

import Button from '@/components/Button';
import { useSnapStore, useToastStore } from '@/utils/stores';

interface DeleteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  vc?: QueryVCsRequestResult;
  store?: AvailableVCStores | undefined;
}

function DeleteModal({ open, setOpen, vc, store }: DeleteModalProps) {
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
    if (!api) return;
    setOpen(false);
    if (vc) {
      setLoading(true);
      setTitle('Deleting Credential');
      setToastOpen(true);
      setOpen(false);
      let deleteReqOptions;
      if (store) {
        deleteReqOptions = {
          store,
        };
      } else if (vc.metadata.store)
        deleteReqOptions = {
          store: vc.metadata.store as AvailableVCStores | AvailableVCStores[],
        };
      await api.deleteVC(vc.metadata.id, deleteReqOptions);
      // TODO - Delete VC from local state instead of calling queryVCs.

      const vcs = await api.queryVCs();
      if (isError(vcs)) {
        setLoading(false);
        setTitle('Error');
        setToastOpen(true);
        return;
      }
      if (vcs.data) {
        setToastOpen(false);
        setTimeout(() => {
          setTitle('Credential deleted');
          setLoading(false);
          setToastOpen(true);
        }, 100);
        useSnapStore.getState().changeVcs(vcs.data);
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
                  className="font-ubuntu dark:text-navy-blue-50 text-xl font-medium leading-6 text-gray-900 "
                >
                  Delete Credential
                </Dialog.Title>
                <div className="mt-4">
                  <p className="text-md dark:text-navy-blue-200 text-gray-500 ">
                    Approving this action will remove the credential from your
                    wallet. This action cannot be undone.
                  </p>

                  {store && (
                    <p className="text-md dark:text-navy-blue-200 mt-10 text-gray-600 ">
                      Deleting VC from store:{' '}
                      <span className="dark:text-navy-blue-100 font-medium text-gray-800 ">
                        {store}
                      </span>
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-end">
                  <div className="mt-10">
                    <Button
                      onClick={() => setOpen(false)}
                      variant="gray"
                      size="xs"
                    >
                      Cancel
                    </Button>
                  </div>
                  <div className="mt-10 ml-2">
                    <Button
                      onClick={() => deleteVC()}
                      variant="warning"
                      size="xs"
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
