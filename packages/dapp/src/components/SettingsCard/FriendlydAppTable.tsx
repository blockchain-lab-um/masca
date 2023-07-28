import React, { useEffect, useState } from 'react';
import { isError, MascaConfig } from '@blockchain-lab-um/masca-connector';
import { TrashIcon } from '@heroicons/react/24/outline';
import shallow from 'zustand/shallow';

import { useMascaStore, useToastStore } from '@/stores';
import AddFriendlydAppModal from './AddFriendlydAppModal';

export const FriendlydAppTable = () => {
  const [settings, setSettings] = useState<MascaConfig>();
  const [open, setOpen] = useState(false);
  const { api } = useMascaStore(
    (state) => ({
      api: state.mascaApi,
    }),
    shallow
  );

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

  const addFriendlydApp = async (dapp: string) => {
    if (!api) return;
    setOpen(false);

    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: 'Adding Friendly dApp',
        type: 'normal',
        loading: true,
      });
    }, 200);

    const res = await api.addFriendlyDapp();

    if (res) {
      await snapGetSettings();
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: 'Friendly dApp added',
          type: 'success',
          loading: false,
        });
      }, 200);
      return;
    }
    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: 'Failed to add Friendly dApp',
        type: 'error',
        loading: false,
      });
    }, 200);
  };

  const removeFriendlydApp = async (dapp: string) => {
    if (!api) return;

    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: 'Removing Friendly dApp',
        type: 'normal',
        loading: true,
      });
    }, 200);
    const res = await api.removeFriendlyDapp(dapp);
    if (res) {
      await snapGetSettings();
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: 'Friendly dApp removed',
          type: 'success',
          loading: false,
        });
      }, 200);
      return;
    }
    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: 'Failed to remove Friendly dApp',
        type: 'error',
        loading: false,
      });
    }, 200);
  };

  return (
    <div className="mt-5">
      <p className="text-md dark:text-navy-blue-400 text-gray-700 ">
        Friendly dApps are dApps where popups do not appear. Make sure to only
        add dApps you trust!
      </p>
      <table className="dark:border-navy-blue-200 mt-4 w-full border-2 border-gray-300">
        <thead>
          <tr className="text-md">
            <th className="p-2 text-start">Application URL</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {settings?.dApp.friendlyDapps.map((app, i) => (
            <tr
              className="dark:border-navy-blue-500 border-t-2 border-gray-200 text-sm"
              key={i}
            >
              <td className="p-2 text-start">{app}</td>
              <td className="p-2 text-end">
                <button
                  onClick={() => {
                    removeFriendlydApp(app).catch((e) => console.log(e));
                  }}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-md dark:text-orange-accent-dark mt-4 flex justify-end gap-x-2 text-pink-400">
        <button
          /* onClick={() => setOpen(true)} */ onClick={() =>
            addFriendlydApp('')
          }
        >
          Add Masca.io to friendly dApps
        </button>
      </div>
      <AddFriendlydAppModal
        setOpen={setOpen}
        isOpen={open}
        addDapp={addFriendlydApp}
      />
    </div>
  );
};
