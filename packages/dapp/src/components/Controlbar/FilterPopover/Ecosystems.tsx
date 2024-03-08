import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { Checkbox } from '@nextui-org/react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useTableStore } from '@/stores';

const EcosystemNames = {
  ebsi: 'EBSI',
  polygonid: 'PolygonID',
  other: 'Other',
};

export const Ecosystems = () => {
  const t = useTranslations('FilterPopover');
  const [open, setOpen] = useState(false);
  const { ecosystems, setEcosystems } = useTableStore((state) => ({
    ecosystems: state.ecosystems,
    setEcosystems: state.setEcosystems,
  }));

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <div className="dark:text-navy-blue-100 my-1 ml-2 flex items-center gap-x-2 text-gray-700">
          <ChevronRightIcon
            className={clsx(
              'animated-transition h-5 w-5',
              `${open ? 'rotate-90' : ''}`
            )}
          />
          {t('ecosystem')}
        </div>
      </button>
      {open && (
        <div className="dark:bg-navy-blue-500/40 bg-[#FFF8F9] p-2">
          {ecosystems.map((ecosystem) => (
            <div key={ecosystem.ecosystem}>
              <Checkbox
                size="md"
                radius="sm"
                key={ecosystem.ecosystem}
                isSelected={ecosystem.selected}
                onValueChange={(selected) => {
                  const newDataStores = ecosystems.map((ds) => {
                    if (ds.ecosystem === ecosystem.ecosystem) {
                      return {
                        ...ecosystem,
                        selected,
                      };
                    }
                    return ds;
                  });
                  setEcosystems(newDataStores);
                }}
              >
                <div className="dark:text-navy-blue-200">
                  {EcosystemNames[ecosystem.ecosystem]}
                </div>
              </Checkbox>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
