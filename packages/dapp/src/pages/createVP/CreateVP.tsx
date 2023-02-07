/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Link from 'next/link';
import React, { useState } from 'react';
import ConnectedGateway from 'src/components/ConnectedGateway';
import MetaMaskGateway from 'src/components/MetaMaskGateway';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import DropdownMenu from 'src/components/DropdownMenu';
import Button from 'src/components/Button';
import ToggleSwitch from 'src/components/Switch';
import InputField from 'src/components/InputField';
import { useTableStore } from '../../utils/store';
import { SelectedVCsTableRow } from './SelectedVCsTableRow';

export const CreateVP = () => {
  const selectedVCs = useTableStore((state) => state.selectedVCs);
  const setSelectedVCs = useTableStore((state) => state.setSelectedVCs);
  const [format, setFormat] = useState('jwt');
  const [advanced, setAdvanced] = useState(false);
  const [challenge, setChallenge] = useState('');
  const [domain, setDomain] = useState('');

  const handleRemove = (id: string) => {
    setSelectedVCs(selectedVCs?.filter((vc) => vc.metadata.id !== id));
  };

  const handleCreateVP = () => {
    console.log('Create VP');
  };

  return (
    <MetaMaskGateway>
      <div className="grid place-items-center">
        <div className="max-w-sm md:max-w-md lg:max-w-lg xl:max-w-[34rem] xl:w-[34rem] w-full h-full flex flex-col min-h-[40vh] border border-gray-200 bg-white dark:bg-gray-800 dark:shadow-orange-900  rounded-3xl shadow-lg">
          <ConnectedGateway>
            <div className="px-5 pt-5 w-full flex justify-between">
              <Link href="dashboard">
                <button className="text-gray-900 hover:bg-orange-100 p-1 hover:text-orange-700 animated-transition rounded-full">
                  <ArrowLeftIcon className="w-6 h-6" />
                </button>
              </Link>
              <div className="text-h3 font-semibold">Create Presentation</div>
            </div>
            <div className="mt-6 text-orange-500 font-semibold pl-2 text-sm">
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
                <div className="pr-4">
                  <ToggleSwitch
                    variant="gray"
                    size="xs"
                    shadow="lg"
                    enabled={advanced}
                    setEnabled={setAdvanced}
                  />
                </div>
              </div>
              {advanced && (
                <div className="px-4">
                  <div className="text-gray-800 text-xs pl-3 my-2">
                    CHALLENGE
                  </div>
                  <div className="max-w-xs">
                    <InputField
                      variant="gray"
                      size="sm"
                      placeholder="challenge"
                      rounded="xl"
                      value={challenge}
                      setValue={setChallenge}
                    />
                  </div>
                  <div className="text-gray-800 text-xs pl-3 my-2">DOMAIN</div>
                  <div className="max-w-xs">
                    <InputField
                      variant="gray"
                      size="sm"
                      placeholder="domain"
                      rounded="xl"
                      value={domain}
                      setValue={setDomain}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex mt-auto justify-end p-3">
              <Button variant="primary" size="sm" onClick={handleCreateVP}>
                Create Presentation
              </Button>
            </div>
          </ConnectedGateway>
        </div>
      </div>
    </MetaMaskGateway>
  );
};
