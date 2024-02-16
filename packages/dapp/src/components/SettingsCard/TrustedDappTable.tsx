import React, { useEffect, useMemo, useState } from 'react';
import {
  DappPermissions,
  isError,
  isSuccess,
  MascaConfig,
} from '@blockchain-lab-um/masca-connector';
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
  const [permissions, setPermissions] = useState<
    Record<string, DappPermissions>
  >({});
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
    setPermissions(snapSettings.data.dApp.permissions);
  };
  useEffect(() => {
    snapGetSettings().catch((e) => console.log(e));
  }, []);

  const addTrustedDapp = async (dapp: string) => {
    if (!api || !dapp) return false;

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

    if (res && isSuccess(res)) {
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
      return true;
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
    return false;
  };

  const addDappToList = async (url: string) => {
    if (!url) return false;

    try {
      let { hostname } = new URL(url);

      if (!permissions) return false;

      // remove www. from hostname
      if (hostname.startsWith('www.')) {
        hostname = hostname.slice(4);
      }

      const newDappPermission = {
        trustedDapp: false,
        queryCredentials: false,
        saveCredential: false,
        createPresentation: false,
        deleteCredential: false,
        togglePopups: false,
        addTrustedDapp: false,
        removeTrustedDapp: false,
        getDID: false,
        getSelectedMethod: false,
        getAvailableMethods: false,
        switchDIDMethod: false,
        getCredentialStore: false,
        setCredentialStore: false,
        getAvailableCredentialStores: false,
        getAccountSettings: false,
        getSnapSettings: false,
        getWalletId: false,
        resolveDID: false,
        createCredential: false,
        setCurrentAccount: false,
        verifyData: false,
        handleCredentialOffer: false,
        handleAuthorizationRequest: false,
        setCeramicSession: false,
        validateStoredCeramicSession: false,
        exportStateBackup: false,
        importStateBackup: false,
        signData: false,
        changePermission: false,
      };

      console.log('np');

      setPermissions({ ...permissions, [hostname]: newDappPermission });
    } catch (e) {
      console.log(e);
      return false;
    }
    return true;
  };

  const removeTrustedDapp = async (dapp: string) => {
    if (!api || !dapp) return true;

    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: t('removing'),
        type: 'normal',
        loading: true,
        link: null,
      });
    }, 200);
    const res = await api.removeTrustedDapp(dapp);
    if (res && isSuccess(res)) {
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
      return false;
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
    return true;
  };

  const changePermission = async (
    dapp: string,
    method: string,
    value: boolean
  ) => {
    if (!api || !dapp) return !value;

    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: t('changingPermission'),
        type: 'normal',
        loading: true,
        link: null,
      });
    }, 200);
    const res = await api.changePermission(dapp, 'queryCredentials', value);

    if (res && isSuccess(res)) {
      await snapGetSettings();
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('changedPermission'),
          type: 'success',
          loading: false,
          link: null,
        });
      }, 200);
      return res.data;
    }
    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: t('change-failed'),
        type: 'error',
        loading: false,
        link: null,
      });
    }, 200);
    return !value;
  };

  const openModal = (dapp: any) => {
    console.log('opening modal..', dapp);
    setCurrentDapp(dapp);
    onOpen();
  };

  const manageTrustedDapp = async (e: any, dapp: string) => {
    if (!api) return false;
    let res;
    if (e) {
      res = await addTrustedDapp(dapp);
    } else {
      res = await removeTrustedDapp(dapp);
    }

    return res;
  };

  const managePermissions = async (e: any, dapp: string) => {
    if (!api) return false;

    const res = await changePermission(dapp, 'queryCredentials', e);

    return res;
  };

  const tableRows = useMemo(() => {
    console.log('in use memo');
    return Object.keys(permissions).map((app, i) => {
      const dappPermissions = permissions[app];

      return (
        <tr
          className="dark:border-navy-blue-500 border-t-2 border-gray-200 text-sm"
          key={i}
        >
          <td className="dark:text-navy-blue-200 p-2 text-start text-xl font-medium">
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
                openModal({ title: app, permissions: dappPermissions });
              }}
              variant={'primary'}
              size="icon"
            >
              {t('manage')}
            </Button>
          </td>
        </tr>
      );
    });
  }, [permissions]);

  return (
    <>
      <p className="text-md dark:text-navy-blue-400 text-gray-700">
        {t('popups-desc')}
      </p>
      <div className="mt-4 flex w-1/2 gap-x-4">
        <InputField value={origin} setValue={setOrigin} />
        <Button
          variant="primary"
          size="xs"
          onClick={async () => {
            await addDappToList(origin);
          }}
        >
          {t('add')}
        </Button>
      </div>

      <table className="dark:border-navy-blue-200 my-5 w-full border-2 border-gray-300">
        <thead>
          <tr className="text-md">
            <th className="dark:text-navy-blue-300 p-2 text-start">
              {t('app-url')}
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
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
                <div className="mb-4 flex flex-col gap-y-4">
                  <Checkbox
                    onValueChange={(e) => {
                      manageTrustedDapp(e, currentDapp.title)
                        .then((res) => {
                          setCurrentDapp({
                            ...currentDapp,
                            permissions: {
                              ...currentDapp.permissions,
                              trustedDapp: res,
                            },
                          });
                        })
                        .catch((err) => {});
                    }}
                    isSelected={currentDapp.permissions.trustedDapp}
                  >
                    <div className="text-navy-blue-50 flex">
                      {t('disable-popups')}
                      <InfoIcon content={t('disable-popups-desc')} />
                    </div>
                  </Checkbox>
                  <Checkbox
                    onValueChange={(e) => {
                      managePermissions(e, currentDapp.title)
                        .then((res) => {
                          setCurrentDapp({
                            ...currentDapp,
                            permissions: {
                              ...currentDapp.permissions,
                              queryCredentials: res,
                            },
                          });
                        })
                        .catch((err) => {});
                    }}
                    isSelected={currentDapp.permissions.queryCredentials}
                  >
                    <div className="text-navy-blue-50 flex">
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
