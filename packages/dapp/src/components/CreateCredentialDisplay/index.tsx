'use client';

import {
  type AvailableCredentialStores,
  type QueryCredentialsRequestResult,
  type Result,
  type SupportedProofFormats,
  isError,
  isSuccess,
} from '@blockchain-lab-um/masca-connector';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import type { VerifiableCredential } from '@veramo/core';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';

import Button from '@/components/Button';
import DropdownMenu from '@/components/DropdownMenu';
import InfoIcon from '@/components/InfoIcon';
import ToggleSwitch from '@/components/Switch';
import { useMascaStore, useToastStore } from '@/stores';
import DropdownMultiselect from '../DropdownMultiselect';
import VCModal from '../VCModal';
import { capitalizeString } from '@/utils/format';

const proofFormats: Record<string, SupportedProofFormats> = {
  JWT: 'jwt',
  'JSON-LD': 'lds',
  EIP712Signature: 'EthereumEip712Signature2021',
};

const CreateCredentialDisplay = () => {
  const t = useTranslations('CreateCredentialDisplay');
  const [loading, setLoading] = useState(false);
  const [vcModalOpen, setVCModalOpen] = useState(false);
  const [vc, setVC] = useState<VerifiableCredential | null>(null);
  const [isInvalidMethod, setInvalidMethod] = useState(false);
  const [credentialPayload, setCredentialPayload] = useState('');
  const credentialStores = useMascaStore(
    (state) => state.availableCredentialStores
  );
  const availableStores = Object.entries(credentialStores)
    .filter(([, value]) => value)
    .map(([key]) => key as AvailableCredentialStores);
  const [selectedItems, setSelectedItems] =
    useState<AvailableCredentialStores[]>(availableStores);
  const { didMethod, api, did, setVCs } = useMascaStore(
    (state) => ({
      didMethod: state.currDIDMethod,
      api: state.mascaApi,
      did: state.currDID,
      setVCs: state.changeVcs,
    }),
    shallow
  );

  const [format, setFormat] = useState('JWT');
  const [save, setSave] = useState(false);
  const [availableProofFormats, setAvailableProofFormats] = useState([
    'JWT',
    'JSON-LD',
    'EIP712Signature',
  ]);

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
    const payload = JSON.stringify(
      {
        type: ['VerifiableCredential', 'MascaUserCredential'],
        credentialSubject: {
          id: did,
          type: 'Regular User',
        },
        credentialSchema: {
          id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
          type: 'JsonSchemaValidator2018',
        },
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json',
        ],
      },
      null,
      2
    );
    setCredentialPayload(payload);
  }, [did]);

  const handleCreateVC = async () => {
    if (!api) return;
    setLoading(true);
    let vcObj = null;
    try {
      vcObj = JSON.parse(credentialPayload);
    } catch (e) {
      console.error(e);
      setLoading(false);
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('toast.error-json'),
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
      return;
    }
    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: t('toast.loading'),
        type: 'normal',
        loading: true,
        link: null,
      });
    }, 200);

    const res = await api.createCredential({
      minimalUnsignedCredential: vcObj,
      proofFormat: proofFormats[format],
      options: {
        save,
        store: selectedItems.map((store) =>
          store.toLowerCase()
        ) as AvailableCredentialStores[],
      },
    });

    if (save) {
      api
        .queryCredentials()
        .then((vcs: Result<QueryCredentialsRequestResult[]>) => {
          if (isSuccess(vcs)) {
            setVCs(vcs.data);
          }
        })
        .catch((e: any) => console.error(e));
    }

    useToastStore.setState({
      open: false,
    });

    if (isError(res)) {
      console.error(res);
      setLoading(false);
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('toast.error-vc'),
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
      return;
    }

    setVC(res.data);
    setTimeout(() => {
      useToastStore.setState({
        open: true,
        title: t('toast.success'),
        type: 'success',
        loading: false,
        link: null,
      });
    }, 200);
    setVCModalOpen(true);
    setLoading(false);
  };
  return (
    <div className="flex h-full flex-col p-6">
      <div className="flex w-full justify-between">
        <Link href="/app" className="flex items-center">
          <button
            type="button"
            className="animated-transition dark:text-navy-blue-50 dark:hover:bg-navy-blue-700 rounded-full text-gray-800 hover:bg-pink-100 hover:text-pink-700"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
        </Link>
        <div className="text-h3 dark:text-navy-blue-50 font-semibold text-gray-800">
          {t('title')}
        </div>
      </div>

      <div className="mt-5 h-full">
        <div className="dark:bg-navy-blue-300 dark:border-navy-blue-400 group relative z-0 h-full rounded-2xl border border-gray-200 bg-gray-100 pr-2 pt-1">
          <textarea
            className={clsx(
              'group-hover:scrollbar-thumb-orange-300 dark:text-navy-blue-800 dark:bg-navy-blue-300',
              'scrollbar-thin scrollbar-thumb-orange-300/0 scrollbar-thumb-rounded-full font-jetbrains-mono',
              'h-full w-full resize-none rounded-2xl bg-gray-100 p-2 text-gray-700 focus:outline-none'
            )}
            placeholder="Credential Payload..."
            value={credentialPayload}
            onChange={(e) => setCredentialPayload(e.target.value)}
          />
        </div>
      </div>
      {!isInvalidMethod && (
        <>
          <div className="mt-5">
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
            <div className="mt-5 flex items-baseline justify-between">
              <div className="text-h5 dark:text-navy-blue-100 font-ubuntu mt-8 flex font-medium text-gray-800">
                {t('save.title')} <InfoIcon content={t('save.description')} />
              </div>
              <div className="">
                <ToggleSwitch
                  variant="gray"
                  size="sm"
                  shadow="lg"
                  enabled={save}
                  setEnabled={setSave}
                />
              </div>
            </div>
            {save && (
              <div className="mt-8 flex items-center justify-between gap-x-8 pb-5">
                <span className="text-md dark:text-navy-blue-200 flex gap-x-1 text-gray-700">
                  {t('save.storage')}
                </span>
                <div className="flex flex-1">
                  <DropdownMultiselect
                    items={availableStores.map((store) =>
                      capitalizeString(store)
                    )}
                    selectedItems={
                      selectedItems.map((store) =>
                        capitalizeString(store)
                      ) as AvailableCredentialStores[]
                    }
                    setSelectedItems={setSelectedItems}
                    placeholder={t('save.select-storage-placeholder')}
                    name="storage"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="mt-5 flex justify-end">
            <Button
              variant="primary"
              size="sm"
              shadow="sm"
              onClick={handleCreateVC}
              loading={loading}
            >
              {t('title')}
            </Button>
          </div>
        </>
      )}
      {isInvalidMethod && (
        <div className="mt-6 text-center text-red-500">
          {t('invalidMethod')}
        </div>
      )}
      <VCModal
        isOpen={vcModalOpen}
        setOpen={setVCModalOpen}
        vc={vc as unknown as VerifiableCredential}
      />
    </div>
  );
};

export default CreateCredentialDisplay;
