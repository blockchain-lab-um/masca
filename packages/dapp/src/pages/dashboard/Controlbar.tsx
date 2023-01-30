import React from 'react';
import DataStoreCombobox from '../../components/VCTable/DataStoreCombobox';
import GlobalFilter from '../../components/VCTable/GlobalFilter';

export const Controlbar = () => {
  return (
    <div className="grid grid-flow-col my-2">
      <DataStoreCombobox />
      <GlobalFilter />
    </div>
  );
};
