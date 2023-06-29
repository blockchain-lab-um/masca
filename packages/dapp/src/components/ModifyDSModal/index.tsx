import { useState } from 'react';
import {
  AvailableVCStores,
  QueryVCsRequestResult,
} from '@blockchain-lab-um/masca-types';
import { isError } from '@blockchain-lab-um/utils';
import { Dialog } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import { shallow } from 'zustand/shallow';

import Button from '@/components//Button';
import ToggleSwitch from '@/components//Switch';
import Modal from '@/components/Modal';
import { useMascaStore, useToastStore } from '@/stores';

interface ModifyDSModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  vc: QueryVCsRequestResult;
}

function ModifyDSModal({ isOpen, setOpen, vc }: ModifyDSModalProps) {
  const t = useTranslations('ModifyDataStoreModal');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [deleteModalStore, setDeleteModalStore] = useState<
    AvailableVCStores | undefined
  >(undefined);
  const { enabledStores, api, changeVcs, changeLastFetch } = useMascaStore(
    (state) => ({
      enabledStores: state.availableVCStores,
      api: state.mascaApi,
      changeVcs: state.changeVcs,
      changeLastFetch: state.changeLastFetch,
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
    if (!api) return;

    if (!enabled) {
      setDeleteModalStore(store);
      setDeleteModalOpen(true);
      return;
    }

    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: 'Saving credential',
        type: 'normal',
        loading: true,
      });
    }, 200);

    const res = await api.saveVC(vc.data, { store });

    if (isError(res)) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: 'Error while saving credential',
          type: 'error',
          loading: false,
        });
      }, 200);
      return;
    }

    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: 'Credential saved',
        type: 'success',
        loading: false,
      });
    }, 200);

    const vcs = await api.queryVCs();

    if (isError(vcs)) {
      console.log(vcs.error);
      return;
    }

    changeVcs(vcs.data);
    changeLastFetch(Date.now());
  };

  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      <Dialog.Title
        as="h3"
        className="font-ubuntu dark:text-navy-blue-50 text-xl font-medium leading-6 text-gray-900"
      >
        {t('title')}
      </Dialog.Title>
      <div className="mt-2">
        <p className="text-md dark:text-navy-blue-200 text-gray-500">
          {t('desc')}
        </p>
      </div>
      <div className="dark:text-navy-blue-100 mt-10 text-gray-700">
        {Object.keys(vcStores).map((store, id) => (
          <div key={id} className="mt-3 flex items-center justify-between">
            <div>{store}</div>
            <span className={`${!vcStores[store].enabled ? 'opacity-60' : ''}`}>
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
        <div className="-mr-2 mt-10">
          <Button onClick={() => setOpen(false)} variant="done" size="xs">
            {t('done')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ModifyDSModal;
