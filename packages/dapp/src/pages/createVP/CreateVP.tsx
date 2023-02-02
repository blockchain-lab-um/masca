import React from 'react';
import ConnectedGateway from 'src/components/ConnectedGateway';
import MetaMaskGateway from 'src/components/MetaMaskGateway';
import { useGeneralStore, useTableStore } from '../../utils/store';

export const CreateVP = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
  const table = useTableStore((state) => state.table);
  const isConnected = useGeneralStore((state) => state.isConnected);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  console.log('table', table?.getSelectedRowModel().rows.length);
  return (
    <MetaMaskGateway>
      <div className="flex justify-center h-full min-h-[50vh] p-5 bg-white dark:bg-gray-800 dark:shadow-orange-900  rounded-3xl shadow-lg">
        <ConnectedGateway>
          <div className="flex flex-col">
            <div>Nav</div>
            <div>VCs</div>
            <div>Options</div>
            <div>Finish</div>
          </div>
        </ConnectedGateway>
      </div>
    </MetaMaskGateway>
  );
};
