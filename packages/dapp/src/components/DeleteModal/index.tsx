import { Fragment } from 'react';
import {
  AvailableVCStores,
  QueryVCsRequestResult,
} from '@blockchain-lab-um/masca-types';
import { isError } from '@blockchain-lab-um/utils';
import { Dialog, Transition } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import { shallow } from 'zustand/shallow';

import Button from '@/components/Button';
import { useMascaStore, useToastStore } from '@/stores';

interface DeleteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  vc?: QueryVCsRequestResult;
  store?: AvailableVCStores | undefined;
}

function DeleteModal({ open, setOpen, vc, store }: DeleteModalProps) {
  const t = useTranslations('DeleteCredentialModal');
  const { api, changeVcs } = useMascaStore(
    (state) => ({
      api: state.mascaApi,
      changeVcs: state.changeVcs,
    }),
    shallow
  );
  const { setTitle, setLoading, setToastOpen, setType } = useToastStore(
    (state) => ({
      setTitle: state.setTitle,
      setText: state.setText,
      setLoading: state.setLoading,
      setToastOpen: state.setOpen,
      setType: state.setType,
    }),
    shallow
  );

  const deleteVC = async () => {
    if (!api) return;
    setOpen(false);
    if (vc) {
      setLoading(true);
      setType('normal');
      setTitle('Deleting Credential');
      setToastOpen(true);
      setOpen(false);

      let deleteReqOptions;

      if (store) {
        deleteReqOptions = {
          store,
        } as { store: AvailableVCStores };
      } else if (vc.metadata.store) {
        deleteReqOptions = {
          store: vc.metadata.store,
        } as { store: AvailableVCStores[] };
      }

      const res = await api.deleteVC(vc.metadata.id, deleteReqOptions);

      if (isError(res)) {
        setToastOpen(false);
        setTimeout(() => {
          setTitle('Failed to delete credential');
          setType('error');
          setLoading(false);
          setToastOpen(true);
        }, 100);
        console.log(res.error);
        return;
      }
      // TODO - Delete VC from local state instead of calling queryVCs.

      const vcs = await api.queryVCs();
      if (isError(vcs)) {
        setToastOpen(false);
        setTimeout(() => {
          setType('error');
          setTitle('Failed to load credentials');
          setLoading(false);
          setToastOpen(true);
        }, 100);
        return;
      }
      if (vcs.data) {
        setToastOpen(false);
        setTimeout(() => {
          setType('success');
          setTitle('Credential deleted');
          setLoading(false);
          setToastOpen(true);
        }, 100);
        changeVcs(vcs.data);
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
          <div className="fixed inset-0 bg-black/25 dark:bg-black/60" />
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
              <Dialog.Panel className="dark:bg-navy-blue-500 w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
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
                      {t('cancel')}
                    </Button>
                  </div>
                  <div className="ml-2 mt-10">
                    <Button
                      onClick={() => deleteVC()}
                      variant="warning"
                      size="xs"
                    >
                      {t('delete')}
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
