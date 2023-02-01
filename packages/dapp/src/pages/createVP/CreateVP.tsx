import React from 'react';
import ConnectedGateway from 'src/components/ConnectedGateway';
import MetaMaskGateway from 'src/components/MetaMaskGateway';
import { useGeneralStore, useTableStore } from '../../utils/store';

export const CreateVP = () => {
  const table = useTableStore((state) => state.table);
  const isConnected = useGeneralStore((state) => state.isConnected);

  console.log('table', table?.getSelectedRowModel().rows.length);
  return (
    <MetaMaskGateway>
      <div className="flex justify-center h-full min-h-[50vh] p-5 bg-white dark:bg-gray-800 dark:shadow-orange-900  rounded-3xl shadow-lg">
        <ConnectedGateway>
          <div className="flex flex-col">
            <div>VCs</div>
            <div>Options</div>
            <div>Finish</div>
          </div>
        </ConnectedGateway>
      </div>
    </MetaMaskGateway>
  );
};
