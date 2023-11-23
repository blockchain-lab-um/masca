import React, { useState } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

import { useTableStore } from '@/stores';
import { CheckBox } from './CheckBox';

const ESNames = {
  ebsi: 'EBSI',
  polygonid: 'Polygon',
  other: 'Other',
};

export const Ecosystems = () => {
  const [open, setOpen] = useState(false);
  const { ecosystems, setEcosystems } = useTableStore((state) => ({
    ecosystems: state.ecosystems,
    setEcosystems: state.setEcosystems,
  }));

  return (
    <div>
      <button
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
          Ecosystems
        </div>
      </button>
      {open && (
        <div className="dark:bg-navy-blue-500/40 bg-[#FFF8F9] p-2">
          {ecosystems.map((ecosystem) => (
            <CheckBox
              key={ecosystem.ecosystem}
              selected={ecosystem.selected}
              setSelected={(selected) => {
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
              {ESNames[ecosystem.ecosystem]}
            </CheckBox>
          ))}
        </div>
      )}
    </div>
  );
};
