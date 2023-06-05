'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AvailableVCStores,
  QueryVCsRequestResult,
  SupportedProofFormats,
  VCRequest,
} from '@blockchain-lab-um/masca-types';
import { isError } from '@blockchain-lab-um/utils';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { W3CVerifiablePresentation } from '@veramo/core';
import { useTranslations } from 'next-intl';
import { shallow } from 'zustand/shallow';

import Button from '@/components/Button';
import ConnectedProvider from '@/components/ConnectedProvider';
import DropdownMenu from '@/components/DropdownMenu';
import InfoIcon from '@/components/InfoIcon';
import InputField from '@/components/InputField';
import SelectedVCsTableRow from '@/components/SelectedVCsTableRow/SelectedVCsTableRow';
import ToggleSwitch from '@/components/Switch';
import VPModal from '@/components/VPModal';
import { useMascaStore, useTableStore } from '@/stores';

const proofFormats: Record<string, SupportedProofFormats> = {
  JWT: 'jwt',
  'JSON-LD': 'lds',
  EIP712Signature: 'EthereumEip712Signature2021',
};

// export const metadata: Metadata = {
//   title: 'Create Verifiable Presentation',
//   description:
//     'Page to create a Verifiable Presentation from selected Verifiable Credentials.',
// };

export default function Page() {
  const t = useTranslations('CreateVerifiablePresentation');
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

  const api = useMascaStore((state) => state.mascaApi);

  const [format, setFormat] = useState('JWT');
  const [advanced, setAdvanced] = useState(false);
  const [challenge, setChallenge] = useState('');
  const [domain, setDomain] = useState('');

  const handleRemove = (id: string) => {
    setSelectedVCs(
      selectedVCs?.filter((vc: QueryVCsRequestResult) => vc.metadata.id !== id)
    );
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
      <div className="flex justify-center">
        <div className="dark:bg-navy-blue-800 dark:text-navy-blue-400 flex h-full min-h-[40vh] w-full max-w-sm flex-col rounded-3xl bg-white shadow-lg md:max-w-md lg:max-w-xl xl:w-[34rem] xl:max-w-[40rem]">
          <ConnectedProvider>
            <div className="mt-5 flex w-full justify-between px-5">
              <Link href="dashboard">
                <button className="animated-transition dark:text-navy-blue-50 dark:hover:bg-navy-blue-700 rounded-full p-1 text-gray-900 hover:bg-pink-100 hover:text-pink-700">
                  <ArrowLeftIcon className="h-6 w-6" />
                </button>
              </Link>
              <div className="text-h3 dark:text-navy-blue-50 font-semibold text-gray-900">
                {t('title')}
              </div>
            </div>
            <div className="mt-4">
              <div className="font-ubuntu dark:text-navy-blue-100 dark:border-navy-blue-600 border-b border-gray-400 p-4 pb-5 text-xl font-medium text-gray-800">
                {t('table.title')}
              </div>
              <table className="mt-2 w-full text-center text-sm">
                <thead>
                  <tr className=" dark:text-navy-blue-400 text-gray-600">
                    <th className="px-3 pb-4 font-semibold"></th>
                    <th className="px-3 pb-4 font-semibold">
                      {t('table.type')}
                    </th>
                    <th className="px-3 pb-4 font-semibold">
                      {t('table.issuer')}
                    </th>
                    <th className="px-3 pb-4 font-semibold">
                      {t('table.status')}
                    </th>
                    <th className="px-3 pb-4 font-semibold">
                      {t('table.remove')}
                    </th>
                  </tr>
                </thead>
                <tbody className="text-md break-all text-gray-800">
                  {selectedVCs.map((vc) => (
                    <SelectedVCsTableRow
                      handleRemove={handleRemove}
                      key={vc.metadata.id}
                      vc={vc}
                    />
                  ))}
                </tbody>
              </table>
              <div className="mt-8 px-4">
                <div className="dark:text-navy-blue-100 text-h5 font-ubuntu mt-8 pl-2 font-medium text-gray-900">
                  {t('options.title')}
                </div>
                <div className="mt-2 flex items-center justify-between px-4">
                  <div className="dark:text-navy-blue-300 px-4 text-gray-600 ">
                    {t('options.format')}
                  </div>
                  <DropdownMenu
                    size="sm"
                    rounded="full"
                    shadow="none"
                    variant="primary-active"
                    selected={format}
                    setSelected={setFormat}
                    items={['JWT', 'JSON-LD', 'EIP712Signature']}
                  />
                </div>
              </div>
              <div>
                <div className="mt-16 flex items-baseline justify-between border-b border-gray-300 px-4">
                  <div className="text-h5 dark:text-navy-blue-100 font-ubuntu mt-8 flex pl-2 font-medium text-gray-900">
                    {t('advanced.title')}{' '}
                    <InfoIcon>{t('advanced.tooltip')}</InfoIcon>
                  </div>
                  <div className="pr-4">
                    <ToggleSwitch
                      variant="gray"
                      size="sm"
                      shadow="lg"
                      enabled={advanced}
                      setEnabled={setAdvanced}
                    />
                  </div>
                </div>
                {advanced && (
                  <div className="mt-6 px-8">
                    <div className="dark:text-navy-blue-200 mt-2 text-sm font-medium text-gray-600">
                      CHALLENGE
                    </div>
                    <div className="mt-2 max-w-xs">
                      <InputField
                        variant="gray"
                        size="sm"
                        placeholder="challenge"
                        rounded="xl"
                        shadow="none"
                        value={challenge}
                        setValue={setChallenge}
                      />
                    </div>
                    <div className="dark:text-navy-blue-200 mt-6 text-sm font-medium text-gray-600">
                      DOMAIN
                    </div>
                    <div className="mt-2 max-w-xs">
                      <InputField
                        variant="gray"
                        size="sm"
                        placeholder="domain"
                        rounded="xl"
                        shadow="none"
                        value={domain}
                        setValue={setDomain}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-8 flex justify-end p-3">
              <Button
                variant="primary"
                size="sm"
                onClick={handleCreateVP}
                loading={loading}
              >
                {t('title')}
              </Button>
            </div>
          </ConnectedProvider>
        </div>
      </div>
      <VPModal
        open={vpModalOpen}
        setOpen={setVpModalOpen}
        vp={vp as W3CVerifiablePresentation}
      />
    </>
  );
}
