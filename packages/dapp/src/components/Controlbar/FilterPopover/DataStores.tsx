import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { Checkbox } from '@nextui-org/react';
import { cn } from '@/utils/shadcn';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useTableStore } from '@/stores';

const DataStoreNames = {
  snap: 'Snap',
  ceramic: 'Ceramic',
};

export const DataStores = () => {
  const t = useTranslations('FilterPopover');
  const [open, setOpen] = useState(false);
  const { dataStores, setDataStores } = useTableStore((state) => ({
    dataStores: state.dataStores,
    setDataStores: state.setDataStores,
  }));

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <div className="dark:text-navy-blue-100 my-1 ml-2 mt-4 flex items-center gap-x-2 text-gray-700">
          <ChevronRightIcon
            className={cn(
              'animated-transition h-5 w-5',
              `${open ? 'rotate-90' : ''}`
            )}
          />
          {t('datastore')}
        </div>
      </button>
      {open && (
        <div className="dark:bg-navy-blue-500/40 bg-[#FFF8F9] p-2">
          {dataStores.map((dataStore) => (
            <div key={dataStore.dataStore}>
              <Checkbox
                size="md"
                radius="sm"
                isSelected={dataStore.selected}
                onValueChange={(selected) => {
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
                <div className="dark:text-navy-blue-200">
                  {DataStoreNames[dataStore.dataStore]}
                </div>
              </Checkbox>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
