import React, { useState } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

import { useTableStore } from '@/stores';
import { CheckBox } from './CheckBox';

export const CredentialTypes = () => {
  const [open, setOpen] = useState(false);
  const { credentialTypes, setCredentialTypes } = useTableStore((state) => ({
    credentialTypes: state.credentialTypes,
    setCredentialTypes: state.setCredentialTypes,
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
          Types
        </div>
      </button>
      {open && (
        <div className="bg-pink-50">
          {credentialTypes.map((type) => (
            <CheckBox
              key={type.type}
              selected={type.selected}
              setSelected={(selected) => {
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
              {type.type}
            </CheckBox>
          ))}
        </div>
      )}
    </div>
  );
};
