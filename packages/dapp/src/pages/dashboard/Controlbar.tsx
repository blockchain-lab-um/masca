import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
import React from 'react';
import DataStoreCombobox from '../../components/VCTable/DataStoreCombobox';
import GlobalFilter from '../../components/VCTable/GlobalFilter';

type ControlbarProps = {
  vcs: QueryVCsRequestResult[];
  isConnected: boolean;
};

export const Controlbar = ({ vcs, isConnected }: ControlbarProps) => {
  return (
    <div className="flex gap-x-2 justify-start mb-4 mt-6">
      <DataStoreCombobox isConnected={isConnected} vcs={vcs} />
      <GlobalFilter isConnected={isConnected} vcs={vcs} />
    </div>
  );
};
