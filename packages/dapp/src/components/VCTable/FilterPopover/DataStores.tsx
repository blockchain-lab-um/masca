import React, { useState } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

import { useTableStore } from '@/stores';
import { CheckBox } from './CheckBox';

export const DataStores = () => {
  const [open, setOpen] = useState(false);
  const { dataStores, setDataStores } = useTableStore((state) => ({
    dataStores: state.dataStores,
    setDataStores: state.setDataStores,
  }));

  return (
    <div>
      <button
        onClick={() => {
          setOpen(!open);
        }}
      >
        <div className="flex items-center">
          <ChevronRightIcon
            className={clsx(
              'animated-transition h-5 w-5 text-gray-700',
              `${open ? 'rotate-90' : ''}`
            )}
          />
          Stores
        </div>
      </button>
      {open && (
        <div className="bg-pink-50">
          {dataStores.map((dataStore) => (
            <CheckBox
              key={dataStore.dataStore}
              selected={dataStore.selected}
              setSelected={(selected) => {
                const newDataStores = dataStores.map((ds) => {
                  if (ds.dataStore === dataStore.dataStore) {
                    return {
                      ...dataStore,
                      selected,
                    };
                  }
                  return ds;
                });
                setDataStores(newDataStores);
              }}
            >
              {dataStore.dataStore}
            </CheckBox>
          ))}
        </div>
      )}
    </div>
  );
};
