import {
  type AvailableCredentialStores,
  type QueryCredentialsRequestResult,
  isError,
} from '@blockchain-lab-um/masca-connector';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { useTranslations } from 'next-intl';

import Button from '@/components/Button';
import { useMascaStore, useToastStore } from '@/stores';
import { capitalizeString, stringifyCredentialSubject } from '@/utils/format';

interface DeleteModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  vc?: QueryCredentialsRequestResult;
  store?: AvailableCredentialStores | undefined;
}

function DeleteModal({ isOpen, setOpen, vc, store }: DeleteModalProps) {
  const t = useTranslations('DeleteCredentialModal');
  const { api, changeVcs, changeLastFetch } = useMascaStore((state) => ({
    api: state.mascaApi,
    changeVcs: state.changeVcs,
    changeLastFetch: state.changeLastFetch,
  }));

  const deleteCredential = async () => {
    if (!api) return;
    setOpen(false);
    if (vc) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('deleting-loading'),
          type: 'normal',
          loading: true,
          link: null,
        });
      }, 200);

      let deleteReqOptions;

      if (store) {
        deleteReqOptions = {
          store,
        } as { store: AvailableCredentialStores };
      } else if (vc.metadata.store) {
        deleteReqOptions = {
          store: vc.metadata.store,
        } as { store: AvailableCredentialStores[] };
      }

      const res = await api.deleteCredential(vc.metadata.id, deleteReqOptions);

      useToastStore.setState({
        open: false,
      });

      if (isError(res)) {
        setTimeout(() => {
          useToastStore.setState({
            open: true,
            title: t('deleting-error'),
            type: 'error',
            loading: false,
            link: null,
          });
        }, 200);
        console.log(res.error);
        return;
      }

      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('deleting-success'),
          type: 'success',
          loading: false,
          link: null,
        });
      }, 200);

      // TODO - Delete VC from local state instead of calling queryCredentials.
      const vcs = await api.queryCredentials();
      if (isError(vcs)) {
        console.log(vcs.error);
        return;
      }

      changeLastFetch(Date.now());

      if (vcs.data) {
        changeVcs(
          vcs.data.map((modifyVC) => stringifyCredentialSubject(modifyVC))
        );
      }
    }
  };

  return (
    <Modal
      backdrop="blur"
      size="md"
      isOpen={isOpen}
      onClose={() => setOpen(false)}
      hideCloseButton={true}
      placement="center"
      className="main-bg mx-4 py-2"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              <div className="text-h3 font-ubuntu dark:text-navy-blue-50 w-full text-center font-medium leading-6 text-gray-900">
                {t('title')}
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="mt-8">
                <p className="text-md dark:text-navy-blue-200 max-w-sm text-center text-gray-700">
                  {t('desc')}
                </p>

                {store && (
                  <p className="text-md dark:text-navy-blue-200 mt-10 text-center text-gray-600 ">
                    {t('deleting')}
                    <span className="dark:text-navy-blue-100 font-medium text-gray-800 ">
                      {capitalizeString(store)}
                    </span>
                  </p>
                )}
              </div>
              <div className="flex items-center justify-end">
                <div className="mt-10">
                  <Button
                    onClick={() => setOpen(false)}
                    variant="cancel"
                    size="xs"
                  >
                    {t('cancel')}
                  </Button>
                </div>
                <div className="ml-2 mt-10">
                  <Button
                    onClick={() => deleteCredential()}
                    variant="warning"
                    size="xs"
                  >
                    {t('delete')}
                  </Button>
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default DeleteModal;
