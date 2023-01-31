import React from 'react';
import DataStoreCombobox from '../../components/VCTable/DataStoreCombobox';
import GlobalFilter from '../../components/VCTable/GlobalFilter';

export const Controlbar = () => {
  return (
    <div className="flex gap-x-2 justify-start my-2">
      <DataStoreCombobox />
      <GlobalFilter />
    </div>
  );
};
