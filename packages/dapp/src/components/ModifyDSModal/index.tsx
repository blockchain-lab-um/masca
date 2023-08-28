import { useState } from 'react';
import {
  isError,
  type AvailableCredentialStores,
  type QueryCredentialsRequestResult,
} from '@blockchain-lab-um/masca-connector';
import { Dialog } from '@headlessui/react';
import { useTranslations } from 'next-intl';

import Button from '@/components//Button';
import ToggleSwitch from '@/components//Switch';
import DeleteModal from '@/components/DeleteModal';
import Modal from '@/components/Modal';
import { isPolygonVC } from '@/utils/credential';
import { stringifyCredentialSubject } from '@/utils/format';
import { useMascaStore, useToastStore } from '@/stores';

interface ModifyDSModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  vc: QueryCredentialsRequestResult;
}

function ModifyDSModal({ isOpen, setOpen, vc }: ModifyDSModalProps) {
  const t = useTranslations('ModifyDataStoreModal');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [deleteModalStore, setDeleteModalStore] = useState<
    AvailableCredentialStores | undefined
  >(undefined);
  const { enabledStores, api, changeVcs, changeLastFetch } = useMascaStore(
    (state) => ({
      enabledStores: state.availableCredentialStores,
      api: state.mascaApi,
      changeVcs: state.changeVcs,
      changeLastFetch: state.changeLastFetch,
    })
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

  if (isPolygonVC(vc) && vcStores.ceramic && vcStores.ceramic.enabled) {
    vcStores.ceramic.enabled = false;
  }

  const handleDSChange = async (
    store: AvailableCredentialStores,
    enabled: boolean
  ) => {
    if (!api) return;

    if (!enabled) {
      setDeleteModalStore(store);
      setDeleteModalOpen(true);
      return;
    }

    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: t('saving'),
        type: 'normal',
        loading: true,
        link: null,
      });
    }, 200);

    const res = await api.saveCredential(vc.data, { store });

    useToastStore.setState({
      open: false,
    });

    if (isError(res)) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('saving-error'),
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
      return;
    }

    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: t('saving-success'),
        type: 'success',
        loading: false,
        link: null,
      });
    }, 200);

    const vcs = await api.queryCredentials();

    if (isError(vcs)) {
      console.log(vcs.error);
      return;
    }

    changeVcs(vcs.data.map((modifyVC) => stringifyCredentialSubject(modifyVC)));
    changeLastFetch(Date.now());
  };

  return (
    <>
      <Modal isOpen={isOpen} setOpen={setOpen}>
        <Dialog.Title
          as="h3"
          className="font-ubuntu dark:text-navy-blue-50 text-xl font-medium leading-6 text-gray-800"
        >
          {t('title')}
        </Dialog.Title>
        <div className="mt-2">
          <p className="text-md dark:text-navy-blue-200 text-gray-700">
            {t('desc')}
          </p>
        </div>
        <div className="dark:text-navy-blue-100 mt-10 text-gray-700">
          {Object.keys(vcStores).map((store, id) => (
            <div key={id} className="mt-3 flex items-center justify-between">
              <div>{store}</div>
              <span
                className={`${!vcStores[store].enabled ? 'opacity-30' : ''}`}
              >
                <ToggleSwitch
                  enabled={vcStores[store].saved}
                  disabled={!vcStores[store].enabled}
                  setEnabled={(e) => {
                    handleDSChange(store as AvailableCredentialStores, e)
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
          <div className="-mr-2 mt-10">
            <Button onClick={() => setOpen(false)} variant="done" size="xs">
              {t('done')}
            </Button>
          </div>
        </div>
      </Modal>
      <DeleteModal
        isOpen={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        vc={vc}
        store={deleteModalStore}
      />
    </>
  );
}

export default ModifyDSModal;
