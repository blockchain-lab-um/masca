import React, { useEffect, useState } from 'react';
import { isError, MascaConfig } from '@blockchain-lab-um/masca-connector';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

import { useMascaStore, useToastStore } from '@/stores';
import Button from '../Button';
import InputField from '../InputField';

export const TrustedDappTable = () => {
  const t = useTranslations('TrustedDappTable');
  const [settings, setSettings] = useState<MascaConfig>();
  const [origin, setOrigin] = useState<string>('https://masca.io');
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
    setSettings(snapSettings.data);
  };
  useEffect(() => {
    snapGetSettings().catch((e) => console.log(e));
  }, []);

  const addTrustedDapp = async () => {
    if (!api || !origin) return;

    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: t('adding'),
        type: 'normal',
        loading: true,
        link: null,
      });
    }, 200);

    console.log(origin);
    const res = await api.addTrustedDapp(origin);

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

  const removeTrusteddApp = async (dapp: string) => {
    if (!api) return;

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
      return;
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
  };

  return (
    <>
      <p className="text-md dark:text-navy-blue-400 text-gray-700">
        {t('popups-desc')}
      </p>
      <div className="mt-4 flex w-1/2 gap-x-4">
        <InputField value={origin} setValue={setOrigin} />
        <Button variant="primary" size="xs" onClick={() => addTrustedDapp()}>
          {t('add')}
        </Button>
      </div>

      <table className="dark:border-navy-blue-200 my-5 w-full border-2 border-gray-300">
        <thead>
          <tr className="text-md">
            <th className="p-2 text-start">{t('app-url')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {settings?.dApp.trustedDapps.map((app, i) => (
            <tr
              className="dark:border-navy-blue-500 border-t-2 border-gray-200 text-sm"
              key={i}
            >
              <td className="p-2 text-start">{app}</td>
              <td className="p-2 text-end">
                <button
                  onClick={() => {
                    removeTrusteddApp(app).catch((e) => console.log(e));
                  }}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
