import {
  type DappPermissions,
  type MascaConfig,
  isError,
  isSuccess,
} from '@blockchain-lab-um/masca-connector';
import {
  ArrowTopRightOnSquareIcon,
  Cog6ToothIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Switch,
  useDisclosure,
} from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import { useMascaStore, useToastStore } from '@/stores';
import Button from '../Button';
import InputField from '../InputField';

export const TrustedDappTable = () => {
  const t = useTranslations('TrustedDappTable');
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [settings, setSettings] = useState<MascaConfig>();
  const [loading, setLoading] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<
    Record<string, DappPermissions>
  >({});
  const [currentDapp, setCurrentDapp] = useState<any>({
    permissions: {
      trusted: false,
      methods: {
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
        addDappSettings: false,
        removeDappSettings: false,
      },
    },
  });
  const [origin, setOrigin] = useState<string>(window.location.origin);
  const { api } = useMascaStore((state) => ({
    api: state.mascaApi,
  }));

  const snapGetSettings = async () => {
    if (!api) return;
    const snapSettings = await api.getSnapSettings();
    if (isError(snapSettings)) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('get-failed'),
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
      return;
    }
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

    if (isSuccess(res) && res.data) {
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
    if (!url || !api) return;

    try {
      let newUrl = url;
      if (!url.startsWith('http') && !url.startsWith('https')) {
        newUrl = `https://${url}`;
      }

      let { hostname } = new URL(newUrl);

      // remove www. from hostname
      if (hostname.startsWith('www.')) {
        hostname = hostname.slice(4);
      }
      const res = await api.addDappSettings(hostname);
      await snapGetSettings();
      if (isError(res)) {
        setTimeout(() => {
          useToastStore.setState({
            open: true,
            title: t('add-dapp-failed'),
            type: 'error',
            loading: false,
            link: null,
          });
        }, 200);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const removeDappFromList = async (originHostname: string) => {
    if (!originHostname || !api) return;

    const res = await api.removeDappSettings(originHostname);
    await snapGetSettings();

    if (isError(res)) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('remove-dapp-failed'),
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
    }
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
    if (isSuccess(res)) {
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

    if (isSuccess(res)) {
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

  const tableRows = useMemo(
    () =>
      Object.keys(permissions).map((app) => {
        const dappPermissions = permissions[app];

        return (
          <tr
            className="dark:border-navy-blue-500 border-t-2 border-gray-200 text-sm"
            key={app}
          >
            <td className="dark:text-navy-blue-200 p-2 text-start text-lg font-medium">
              <a
                className="dark:text-orange-accent-dark animated-transition flex items-center gap-x-1 text-pink-500 underline hover:opacity-80"
                href={`https://${app}`}
                target="_blank"
                rel="noreferrer"
              >
                {app}
                <ArrowTopRightOnSquareIcon className="dark:text-orange-accent-dark h-4 w-4 text-pink-500" />
              </a>
            </td>
            <td className="flex items-center justify-end gap-x-2 p-2 text-end">
              <button
                type="button"
                onClick={() => {
                  openModal({ title: app, permissions: dappPermissions });
                }}
              >
                <Cog6ToothIcon className="animated-transition dark:text-navy-blue-300 h-6 w-6 text-gray-700 hover:opacity-80" />
              </button>
              <button
                type="button"
                onClick={() => {
                  removeDappFromList(app)
                    .then((res) => {})
                    .catch((err) => {
                      console.log(err);
                    });
                }}
              >
                <TrashIcon className="animated-transition h-6 w-6 text-red-500 hover:opacity-80" />
              </button>
            </td>
          </tr>
        );
      }),
    [permissions]
  );

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

      <table className="dark:border-navy-blue-200 my-5 w-full rounded-full border-2 border-gray-300">
        <thead>
          <tr className="text-md">
            <th className="dark:text-navy-blue-300 p-2 text-start">
              {t('app-url')}
            </th>
            <th />
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="font-ubuntu dark:text-navy-blue-50 flex text-2xl font-medium leading-6 text-gray-800 ">
              {t('modal-title')}
              <span className="ml-1 font-medium">
                <a
                  className="dark:text-orange-accent-dark animated-transition flex items-center gap-x-1 text-pink-500 underline hover:opacity-80"
                  href={`https://${currentDapp.title}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {currentDapp.title}
                  <ArrowTopRightOnSquareIcon className="dark:text-orange-accent-dark h-4 w-4 text-pink-500" />
                </a>
              </span>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="mb-4 mt-2 flex flex-col gap-y-4">
              <div className="flex justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-medium">{t('disable-popups')}</p>
                  <p className="text-tiny dark:text-navy-blue-400 text-gray-500">
                    {t('disable-popups-desc')}
                  </p>
                </div>
                <Switch
                  size="sm"
                  isSelected={currentDapp.permissions.trusted}
                  onValueChange={(e) => {
                    manageTrustedDapp(e, currentDapp.title)
                      .then((res) => {
                        setCurrentDapp({
                          ...currentDapp,
                          permissions: {
                            ...currentDapp.permissions,
                            trusted: res,
                          },
                        });
                      })
                      .catch((err) => {});
                  }}
                  classNames={{
                    wrapper: 'bg-gray-300 dark:bg-navy-blue-500',
                  }}
                />
              </div>

              <hr />
              <div className="flex justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-medium">{t('query')}</p>
                  <p className="text-tiny dark:text-navy-blue-400 max-w-[250px] text-gray-500">
                    {t('query-desc')}
                  </p>
                </div>
                <Switch
                  size="sm"
                  isSelected={currentDapp.permissions.methods.queryCredentials}
                  onValueChange={(e) => {
                    managePermissions(e, currentDapp.title)
                      .then((res) => {
                        setCurrentDapp({
                          ...currentDapp,
                          permissions: {
                            ...currentDapp.permissions,
                            methods: {
                              ...currentDapp.permissions.methods,
                              queryCredentials: res,
                            },
                          },
                        });
                      })
                      .catch((err) => {});
                  }}
                  classNames={{
                    wrapper: 'bg-gray-300 dark:bg-navy-blue-500',
                  }}
                />
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
