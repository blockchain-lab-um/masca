'use client';

import {
  type QueryCredentialsRequestResult,
  type SupportedProofFormats,
  isError,
} from '@blockchain-lab-um/masca-connector';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import type {
  W3CVerifiableCredential,
  W3CVerifiablePresentation,
} from '@veramo/core';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Button from '@/components/Button';
import DropdownMenu from '@/components/DropdownMenu';
import InfoIcon from '@/components/InfoIcon';
import InputField from '@/components/InputField';
import SelectedVCsTableRow from '@/components/SelectedVCsTableRow/SelectedVCsTableRow';
import ToggleSwitch from '@/components/Switch';
import VPModal from '@/components/VPModal';
import { useMascaStore, useTableStore } from '@/stores';
import { isPolygonVC } from '@/utils/credential';
import { removeCredentialSubjectFilterString } from '@/utils/format';

const proofFormats: Record<string, SupportedProofFormats> = {
  JWT: 'jwt',
  'JSON-LD': 'lds',
  EIP712Signature: 'EthereumEip712Signature2021',
};

const CreatePresentationDisplay = () => {
  const t = useTranslations('CreatePresentationDisplay');

  const router = useRouter();

  // Local state
  const [loading, setLoading] = useState(false);
  const [vpModalOpen, setVpModalOpen] = useState(false);
  const [vp, setVp] = useState({});
  const [format, setFormat] = useState('JWT');
  const [advanced, setAdvanced] = useState(false);
  const [challenge, setChallenge] = useState('');
  const [domain, setDomain] = useState('');
  const [isInvalidMethod, setInvalidMethod] = useState(false);
  const [includesPolygonVC, setIncludesPolygonVC] = useState(false);
  const [availableProofFormats, setAvailableProofFormats] = useState([
    'JWT',
    'JSON-LD',
    'EIP712Signature',
  ]);

  // Global state
  const { selectedCredentials, setSelectedCredentials } = useTableStore(
    (state) => ({
      selectedCredentials: state.selectedCredentials,
      setSelectedCredentials: state.setSelectedCredentials,
    })
  );
  const { didMethod, api } = useMascaStore((state) => ({
    didMethod: state.currDIDMethod,
    api: state.mascaApi,
  }));

  useEffect(() => {
    setInvalidMethod(false);
    if (didMethod === 'did:polygonid' || didMethod === 'did:iden3') {
      setInvalidMethod(true);
    }
    if (
      didMethod === 'did:ethr' ||
      didMethod === 'did:pkh' ||
      didMethod === 'did:ens'
    ) {
      setAvailableProofFormats(['EIP712Signature']);
      setFormat('EIP712Signature');
    } else {
      setAvailableProofFormats(['JWT', 'JSON-LD', 'EIP712Signature']);
      setFormat('JWT');
    }
  }, [didMethod]);

  useEffect(() => {
    setIncludesPolygonVC(false);
    selectedCredentials?.forEach((vc) => {
      if (isPolygonVC(vc)) {
        setIncludesPolygonVC(true);
      }
    });
  }, [selectedCredentials]);

  const handleRemove = (id: string) => {
    setSelectedCredentials(
      selectedCredentials?.filter(
        (vc: QueryCredentialsRequestResult) => vc.metadata.id !== id
      )
    );
  };

  const handleCreatePresentation = async () => {
    if (!api) return;
    setLoading(true);
    const vcs: W3CVerifiableCredential[] = selectedCredentials.map(
      (vc) => removeCredentialSubjectFilterString(vc).data
    );

    const proofOptions = { type: '', domain, challenge };

    const res = await api.createPresentation({
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
      <div className="mt-5 flex w-full justify-between px-6 pt-2">
        <button
          type="button"
          onClick={() => {
            router.back();
          }}
          className="animated-transition dark:text-navy-blue-50 dark:hover:bg-navy-blue-700 rounded-full text-gray-800 hover:bg-pink-100 hover:text-pink-700"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <div className="text-h3 dark:text-navy-blue-50 font-semibold text-gray-800">
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
              <th className="px-3 pb-4 pl-4 font-semibold" />
              <th className="px-3 pb-4 font-semibold">{t('table.type')}</th>
              <th className="px-3 pb-4 font-semibold">{t('table.issuer')}</th>
              <th className="px-3 pb-4 font-semibold">{t('table.status')}</th>
              <th className="px-3 pb-4 font-semibold">{t('table.remove')}</th>
            </tr>
          </thead>
          <tbody className="text-md break-all text-gray-800">
            {selectedCredentials.map((vc) => (
              <SelectedVCsTableRow
                handleRemove={handleRemove}
                key={vc.metadata.id}
                vc={vc}
              />
            ))}
          </tbody>
        </table>
      </div>
      {!isInvalidMethod && !includesPolygonVC && (
        <>
          <div className="mt-8 px-4">
            <div className="dark:text-navy-blue-100 text-h5 font-ubuntu mt-8 font-medium text-gray-800">
              {t('options.title')}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="dark:text-navy-blue-300 text-gray-700 ">
                {t('options.format')}
              </div>
              <DropdownMenu
                size="xs"
                rounded="full"
                shadow="sm"
                variant="primary-active"
                selected={format}
                setSelected={setFormat}
                items={availableProofFormats}
              />
            </div>
          </div>
          <div>
            <div className="mt-16 flex items-baseline justify-between border-b border-gray-300 px-4">
              <div className="text-h5 dark:text-navy-blue-100 font-ubuntu mt-8 flex font-medium text-gray-800">
                {t('advanced.title')}{' '}
                <InfoIcon content={t('advanced.tooltip')} />
              </div>
              <div className="">
                <ToggleSwitch
                  variant="gray"
                  size="sm"
                  shadow="lg"
                  enabled={advanced}
                  setEnabled={setAdvanced}
                />
              </div>
            </div>
            {advanced && format === 'JWT' && (
              <div className="mt-6 px-4">
                <div className="dark:text-navy-blue-100 mt-2 text-sm font-medium text-gray-700">
                  Challenge
                </div>
                <div className="mt-2 max-w-xs">
                  <InputField
                    variant="primary"
                    size="lg"
                    placeholder="Nonce"
                    rounded="lg"
                    shadow="none"
                    value={challenge}
                    setValue={setChallenge}
                  />
                </div>
                <div className="dark:text-navy-blue-100 mt-6 text-sm font-medium text-gray-700">
                  Domain
                </div>
                <div className="mt-2 max-w-xs">
                  <InputField
                    variant="primary"
                    size="lg"
                    placeholder="www.example.com"
                    rounded="lg"
                    shadow="none"
                    value={domain}
                    setValue={setDomain}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="mt-8 flex justify-end p-3">
            {selectedCredentials.length > 0 && (
              <Button
                variant="primary"
                size="sm"
                shadow="sm"
                onClick={handleCreatePresentation}
                loading={loading}
              >
                {t('title')}
              </Button>
            )}
          </div>
        </>
      )}
      {(isInvalidMethod || includesPolygonVC) && (
        <div className="mt-16 pb-8">
          {isInvalidMethod && (
            <div className="mt-2 p-2 text-center text-red-500">
              {t('invalidMethod')}
            </div>
          )}

          {includesPolygonVC && (
            <div className="mt-2 p-2 text-center text-red-500">
              {t('polygonvc')}
            </div>
          )}
        </div>
      )}
      <VPModal
        isOpen={vpModalOpen}
        setOpen={setVpModalOpen}
        vp={vp as W3CVerifiablePresentation}
      />
    </>
  );
};

export default CreatePresentationDisplay;
