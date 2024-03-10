import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { Checkbox } from '@nextui-org/react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useTableStore } from '@/stores';

export const CredentialTypes = () => {
  const t = useTranslations('FilterPopover');

  const [open, setOpen] = useState(false);
  const { credentialTypes, setCredentialTypes } = useTableStore((state) => ({
    credentialTypes: state.credentialTypes,
    setCredentialTypes: state.setCredentialTypes,
  }));
  const [filter, setFilter] = useState('');

  return (
    <div>
      <div className="flex items-center justify-between pr-2">
        <button
          type="button"
          onClick={() => {
            setOpen(!open);
          }}
        >
          <div className="dark:text-navy-blue-100 my-1 ml-2 flex items-center gap-x-2 text-gray-700">
            <ChevronRightIcon
              className={clsx(
                'animated-transition h-5 w-5 ',
                `${open ? 'rotate-90' : ''}`
              )}
            />
            {t('type')}
          </div>
        </button>
        {open &&
          (credentialTypes.filter((type) => type.selected).length > 0 ? (
            <button
              type="button"
              className="text-sm text-red-500 hover:text-red-700 dark:text-red-300 hover:dark:text-red-500"
              onClick={() => {
                setCredentialTypes(
                  credentialTypes.map((type) => ({
                    ...type,
                    selected: false,
                  }))
                );
              }}
            >
              clear ({credentialTypes.filter((type) => type.selected).length})
            </button>
          ) : (
            <button
              type="button"
              className="text-sm text-red-500 hover:text-red-700 dark:text-red-300 hover:dark:text-red-500"
              onClick={() => {
                setCredentialTypes(
                  credentialTypes.map((type) => ({
                    ...type,
                    selected: true,
                  }))
                );
              }}
            >
              select all
            </button>
          ))}
      </div>
      {open && (
        <div className="dark:bg-navy-blue-500/40  bg-[#FFF8F9] p-2">
          <input
            className="dark:bg-navy-blue-600 dark:text-navy-blue-50 dark:placeholder:text-navy-blue-200 dark:border-navy-blue-300 w-full rounded-md border border-gray-300 bg-white px-2 py-1 focus:outline-none"
            placeholder="Search Types..."
            onChange={(e) => {
              setFilter(e.target.value);
            }}
            value={filter}
          />
          <div className="scrollbar-thumb-rounded scrollbar-thumb-pink-500 dark:scrollbar-thumb-orange-accent-dark scrollbar-thin mt-2 max-h-[160px] overflow-scroll overflow-x-hidden">
            {credentialTypes.map((type) => {
              if (!type.type.toLowerCase().includes(filter.toLowerCase())) {
                return null;
              }

              return (
                <div key={type.type} className="my-2">
                  <Checkbox
                    isSelected={type.selected}
                    onValueChange={(selected) => {
                      const newCredentialTypes = credentialTypes.map((tp) => {
                        if (tp.type === type.type) {
                          return {
                            ...type,
                            selected,
                          };
                        }
                        return tp;
                      });
                      setCredentialTypes(newCredentialTypes);
                    }}
                  >
                    <div className="dark:text-navy-blue-200">{type.type}</div>
                  </Checkbox>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
