/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Link from 'next/link';
import React, { useState } from 'react';
import ConnectedGateway from 'src/components/ConnectedGateway';
import MetaMaskGateway from 'src/components/MetaMaskGateway';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import DropdownMenu from 'src/components/DropdownMenu';
import Button from 'src/components/Button';
import { useTableStore } from '../../utils/store';
import { SelectedVCsTableRow } from './SelectedVCsTableRow';

export const CreateVP = () => {
  const selectedVCs = useTableStore((state) => state.selectedVCs);
  const setSelectedVCs = useTableStore((state) => state.setSelectedVCs);
  const [format, setFormat] = useState('jwt');

  const handleRemove = (id: string) => {
    setSelectedVCs(selectedVCs?.filter((vc) => vc.metadata.id !== id));
  };

  const handleCreateVP = () => {
    console.log('Create VP');
  };

  return (
    <MetaMaskGateway>
      <div className="grid place-items-center">
        <div className="max-w-sm md:max-w-md lg:max-w-lg xl:max-w-[34rem] xl:w-[34rem] w-full h-full min-h-[50vh] border border-gray-200 bg-white dark:bg-gray-800 dark:shadow-orange-900  rounded-3xl shadow-lg">
          <ConnectedGateway>
            <div className="px-5 pt-5 w-full flex justify-between">
              <Link href="dashboard">
                <button className="text-gray-900 hover:bg-orange-100 p-1 hover:text-orange-700 animated-transition rounded-full">
                  <ArrowLeftIcon className="w-6 h-6" />
                </button>
              </Link>
              <div className="text-h3 font-semibold">Create Presentation</div>
            </div>
            <div className="mt-6 w-full">
              <div className="text-orange-500 font-semibold pl-2 text-sm">
                CREDENTIALS
              </div>
              <table className="text-sm w-full text-center">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-900">
                    <th className="px-3 pb-4 font-semibold"></th>
                    <th className="px-3 pb-4 font-semibold">TYPE</th>
                    <th className="px-3 pb-4 font-semibold">ISSUER</th>
                    <th className="px-3 pb-4 font-semibold">STATUS</th>
                    <th className="px-3 pb-4 font-semibold">REMOVE</th>
                  </tr>
                </thead>
                <tbody className="break-all text-gray-800">
                  {selectedVCs.map((vc) => (
                    <SelectedVCsTableRow
                      handleRemove={handleRemove}
                      key={vc.metadata.id}
                      vc={vc}
                    />
                  ))}
                </tbody>
              </table>
              <div className="mt-4">
                <div className="text-orange-500 font-semibold pl-2 text-sm">
                  OPTIONS
                </div>
                <div className="flex justify-between items-center px-4">
                  <div>Format</div>
                  <DropdownMenu
                    size="sm"
                    rounded="full"
                    shadow="lg"
                    variant="primary-active"
                    selected={format}
                    setSelected={setFormat}
                    items={['jwt', 'jsonld', 'eip']}
                  />
                </div>
              </div>
              <div>
                <div className="border-b border-gray-300 flex justify-between items-baseline mt-4">
                  <div className="text-orange-500 font-semibold pl-2 text-sm">
                    ADVANCED
                  </div>
                  <div>show advanced</div>
                </div>
                <div className="px-4">
                  <div>Challenge</div>
                  <div>Domain</div>
                </div>
              </div>

              <div className="flex justify-end bottom-0 p-3">
                <Button variant="primary" size="sm" onClick={handleCreateVP}>
                  Create Presentation
                </Button>
              </div>
            </div>
          </ConnectedGateway>
        </div>
      </div>
    </MetaMaskGateway>
  );
};
