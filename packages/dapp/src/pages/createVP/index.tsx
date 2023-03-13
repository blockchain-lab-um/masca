import React, { useState } from 'react';
import Link from 'next/link';
import {
  AvailableVCStores,
  SupportedProofFormats,
  VCRequest,
} from '@blockchain-lab-um/ssi-snap-types';
import { isError } from '@blockchain-lab-um/utils';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { W3CVerifiablePresentation } from '@veramo/core';
import { shallow } from 'zustand/shallow';

import Button from '@/components/Button';
import ConnectedGateway from '@/components/ConnectedGateway';
import DropdownMenu from '@/components/DropdownMenu';
import InfoIcon from '@/components/InfoIcon';
import InputField from '@/components/InputField';
import MetaMaskGateway from '@/components/MetaMaskGateway';
import SelectedVCsTableRow from '@/components/SelectedVCsTableRow/SelectedVCsTableRow';
import ToggleSwitch from '@/components/Switch';
import VPModal from '@/components/VPModal';
import { useSnapStore, useTableStore } from '@/utils/stores';

const proofFormats: Record<string, SupportedProofFormats> = {
  JWT: 'jwt',
  'JSON-LD': 'lds',
  EthereumEip712Signature2021: 'EthereumEip712Signature2021',
};

const CreateVP = () => {
  const [loading, setLoading] = useState(false);
  const [vpModalOpen, setVpModalOpen] = useState(false);
  const [vp, setVp] = useState({});
  const { selectedVCs, setSelectedVCs } = useTableStore(
    (state) => ({
      selectedVCs: state.selectedVCs,
      setSelectedVCs: state.setSelectedVCs,
    }),
    shallow
  );

  const api = useSnapStore((state) => state.snapApi);

  const [format, setFormat] = useState('jwt');
  const [advanced, setAdvanced] = useState(false);
  const [challenge, setChallenge] = useState('');
  const [domain, setDomain] = useState('');

  const handleRemove = (id: string) => {
    setSelectedVCs(selectedVCs?.filter((vc) => vc.metadata.id !== id));
  };

  const handleCreateVP = async () => {
    if (!api) return;
    setLoading(true);
    const vcs: VCRequest[] = selectedVCs.map((vc) => {
      if (vc.metadata.store) {
        if (typeof vc.metadata.store === 'string')
          return {
            id: vc.metadata.id,
            metadata: {
              store: vc.metadata.store as AvailableVCStores,
            },
          };
        if (Array.isArray(vc.metadata.store))
          return {
            id: vc.metadata.id,
            metadata: {
              store: vc.metadata.store[0] as AvailableVCStores,
            },
          };
      }
      return { id: vc.metadata.id };
    });

    const proofOptions = { type: '', domain, challenge };

    const res = await api.createVP({
      vcs,
      proofFormat: proofFormats[format],
      proofOptions,
    });
    if (isError(res)) {
      console.error(res);
      setLoading(false);
      return;
    }
    setVp(res.data);

    setVpModalOpen(true);
    setLoading(false);
  };

  return (
    <>
      <MetaMaskGateway>
        <div className="grid place-items-center">
          <div className="flex h-full min-h-[40vh] w-full max-w-sm flex-col rounded-3xl border border-gray-200 bg-white shadow-lg dark:bg-gray-800 dark:shadow-orange-900 md:max-w-md lg:max-w-lg  xl:w-[34rem] xl:max-w-[34rem]">
            <ConnectedGateway>
              <div className="flex w-full justify-between px-5 pt-5">
                <Link href="dashboard">
                  <button className="animated-transition rounded-full p-1 text-gray-900 hover:bg-orange-100 hover:text-orange-700">
                    <ArrowLeftIcon className="h-6 w-6" />
                  </button>
                </Link>
                <div className="text-h3 font-semibold">Create Presentation</div>
              </div>
              <div className="mt-6 pl-2 text-sm font-semibold text-orange-500">
                CREDENTIALS
              </div>
              <table className="mt-2 w-full text-center text-sm">
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
              <div className="mt-8">
                <div className="pl-2 text-sm font-semibold text-orange-500 ">
                  OPTIONS
                </div>
                <div className="flex items-center justify-between px-4">
                  <div className="text-gray-900">Format</div>
                  <DropdownMenu
                    size="sm"
                    rounded="full"
                    shadow="md"
                    variant="primary-active"
                    selected={format}
                    setSelected={setFormat}
                    items={['JWT', 'JSON-LD', 'EthereumEip712Signature2021']}
                  />
                </div>
              </div>
              <div>
                <div className="mt-16 flex items-baseline justify-between border-b border-gray-300">
                  <div className="flex gap-x-0.5 pl-2 text-sm font-semibold text-orange-500">
                    ADVANCED{' '}
                    <InfoIcon>Only applicable to JWT Proof format.</InfoIcon>
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
                  <div className="mt-4 px-4">
                    <div className="my-1 text-xs text-gray-700">CHALLENGE</div>
                    <div className="max-w-xs">
                      <InputField
                        variant="gray"
                        size="sm"
                        placeholder="challenge"
                        rounded="xl"
                        shadow="sm"
                        value={challenge}
                        setValue={setChallenge}
                      />
                    </div>
                    <div className="my-1 mt-4 text-xs text-gray-700">
                      DOMAIN
                    </div>
                    <div className="max-w-xs">
                      <InputField
                        variant="gray"
                        size="sm"
                        placeholder="domain"
                        rounded="xl"
                        shadow="sm"
                        value={domain}
                        setValue={setDomain}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end p-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCreateVP}
                  loading={loading}
                >
                  Create Presentation
                </Button>
              </div>
            </ConnectedGateway>
          </div>
        </div>
        <VPModal
          open={vpModalOpen}
          setOpen={setVpModalOpen}
          vp={vp as W3CVerifiablePresentation}
        />
      </MetaMaskGateway>
    </>
  );
};

export default CreateVP;
