import React, { useEffect, useState } from 'react';
import { isError, MascaConfig } from '@blockchain-lab-um/masca-connector';
import {
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { useTranslations } from 'next-intl';

import { useMascaStore, useToastStore } from '@/stores';
import Button from '../Button';
import InfoIcon from '../InfoIcon';
import InputField from '../InputField';

export const TrustedDappTable = () => {
  const t = useTranslations('TrustedDappTable');
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [settings, setSettings] = useState<MascaConfig>();
  const [currentDapp, setCurrentDapp] = useState<any>({});
  const [origin, setOrigin] = useState<string>(window.location.origin);
  const { api } = useMascaStore((state) => ({
    api: state.mascaApi,
  }));

  const snapGetSettings = async () => {
    if (!api) return;
    const snapSettings = await api.getSnapSettings();
    if (isError(snapSettings)) {
      console.log('Error getting snap settings', snapSettings);
      return;
    }
    console.log('snapSettings', snapSettings.data);
    setSettings(snapSettings.data);
  };
  useEffect(() => {
    snapGetSettings().catch((e) => console.log(e));
  }, []);

  const addTrustedDapp = async (dapp: string) => {
    if (!api || !dapp) return;

    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: t('adding'),
        type: 'normal',
        loading: true,
        link: null,
      });
    }, 200);
    const res = await api.addTrustedDapp(dapp);

    if (res) {
      await snapGetSettings();
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('added'),
          type: 'success',
          loading: false,
          link: null,
        });
      }, 200);
      return;
    }
    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: t('add-failed'),
        type: 'error',
        loading: false,
        link: null,
      });
    }, 200);
  };

  const removeTrustedDapp = async (dapp: string) => {
    if (!api || !dapp) return false;

    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: t('removing'),
        type: 'normal',
        loading: true,
        link: null,
      });
    }, 200);
    console.log('removing trusted dapp', dapp);
    const res = await api.removeTrustedDapp(dapp);
    if (res) {
      await snapGetSettings();
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('removed'),
          type: 'success',
          loading: false,
          link: null,
        });
      }, 200);
      return res;
    }
    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: t('remove-failed'),
        type: 'error',
        loading: false,
        link: null,
      });
    }, 200);
    return false;
  };

  const openModal = (dapp: any) => {
    setCurrentDapp(dapp);
    onOpen();
  };

  const manageTrustedDapp = async (e: any, dapp: string) => {
    console.log('manageTrustedDapp', e, dapp);
    if (!api) return false;

    if (e) {
      await addTrustedDapp(dapp);
    } else {
      await removeTrustedDapp(dapp);
    }

    return settings?.dApp.permissions[dapp].trustedDapp ?? false;
  };

  return (
    <>
      <p className="text-gray-700 text-md dark:text-navy-blue-400">
        {t('popups-desc')}
      </p>
      <div className="flex w-1/2 mt-4 gap-x-4">
        <InputField value={origin} setValue={setOrigin} />
        <Button
          variant="primary"
          size="xs"
          onClick={() => addTrustedDapp(origin)}
        >
          {t('add')}
        </Button>
      </div>

      <table className="w-full my-5 border-2 border-gray-300 dark:border-navy-blue-200">
        <thead>
          <tr className="text-md">
            <th className="p-2 dark:text-navy-blue-300 text-start">
              {t('app-url')}
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(settings?.dApp.permissions ?? {}).map((app, i) => {
            const permissions = settings?.dApp.permissions[app];

            return (
              <tr
                className="text-sm border-t-2 border-gray-200 dark:border-navy-blue-500"
                key={i}
              >
                <td className="p-2 text-xl font-medium dark:text-navy-blue-200 text-start">
                  {app}
                </td>
                <td className="flex justify-end p-2 text-end">
                  {/* <button
                    onClick={() => {
                      removeTrustedDapp(app).catch((e) => console.log(e));
                    }}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button> */}
                  <Button
                    onClick={() => {
                      openModal({ title: app, permissions });
                    }}
                    variant={'primary'}
                    size="icon"
                  >
                    {t('manage')}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="text-xl font-medium">
                  {t('modal-title')}
                  <span className="text-2xl font-bold">
                    {currentDapp.title}
                  </span>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col mb-4 gap-y-4">
                  <Checkbox
                    onValueChange={(e) => {
                      manageTrustedDapp(e, currentDapp.title)
                        .then((res) => {
                          console.log('res', res);
                          setCurrentDapp({
                            ...currentDapp,
                            permissions: {
                              ...currentDapp.permissions,
                              trustedDapp: res,
                            },
                          });
                        })
                        .catch((err) => {
                          console.log('err', err);
                        });
                    }}
                    isSelected={currentDapp.permissions.trustedDapp}
                  >
                    <div className="flex text-navy-blue-50">
                      {t('disable-popups')}
                      <InfoIcon content={t('disable-popups-desc')} />
                    </div>
                  </Checkbox>
                  <Checkbox
                    isSelected={currentDapp.permissions.queryCredentials}
                  >
                    <div className="flex text-navy-blue-50">
                      {t('query')}
                      <InfoIcon content={t('query-desc')} />
                    </div>
                  </Checkbox>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
