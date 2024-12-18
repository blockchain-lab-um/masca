'use client';

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { Tooltip } from '@nextui-org/react';
import type { VerifiableCredential } from '@veramo/core';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import JsonModal from '@/components/JsonModal';
import { getFirstWord } from '@/utils/format';
import { convertTypes } from '@/utils/string';
import { Normal } from './templates/Normal';
import { EduCTX } from './templates/EduCTX';
import { SdJwt } from './templates/SdJwt';
import type { SdJwtCredential } from '@blockchain-lab-um/masca-connector';

interface FormattedPanelProps {
  credential: VerifiableCredential | SdJwtCredential;
}

enum Templates {
  Normal = 0,
  EduCTX = 1,
  SdJwt = 2,
}

const CredentialPanel = ({ credential }: FormattedPanelProps) => {
  const t = useTranslations('CredentialPanel');

  const pathname = usePathname();
  const router = useRouter();

  // Local state
  const types = useMemo(() => {
    // Check if the credential is an sd-jwt type
    if (Object.keys(credential).includes('_sd_alg')) {
      return convertTypes((credential as SdJwtCredential).vct);
    }
    return convertTypes(credential.type as string | string[]);
  }, [credential]);

  const [jsonModalOpen, setJsonModalOpen] = useState(false);
  const [selectedJsonData, setSelectedJsonData] = useState({});

  const isValid = useMemo(() => {
    if (!credential.expirationDate) return true;
    return Date.parse(credential.expirationDate as string) > Date.now();
  }, [credential]);

  const selectJsonData = (data: any) => {
    setSelectedJsonData(data);
    setJsonModalOpen(true);
  };

  const template = useMemo(() => {
    const credentialTypes = Array.isArray(credential.type)
      ? credential.type
      : [credential.type];

    if (Object.keys(credential).includes('_sd_alg')) {
      return Templates.SdJwt;
    }

    if (credentialTypes.includes('EducationCredential')) {
      return Templates.EduCTX;
    }

    return Templates.Normal;
  }, [credential]);

  const renderTemplate = useMemo(() => {
    switch (template) {
      case Templates.EduCTX:
        return (
          <EduCTX
            credential={credential as VerifiableCredential}
            title={{
              subject: t('subject'),
              issuer: t('issuer'),
              dates: t('dates'),
            }}
          />
        );
      case Templates.SdJwt:
        return (
          <SdJwt
            credential={credential as SdJwtCredential}
            title={{
              subject: t('subject'),
              issuer: t('issuer'),
              dates: t('dates'),
              disclosures: t('disclosures'),
            }}
            viewJsonText={t('view-json')}
            selectJsonData={selectJsonData}
          />
        );
      default:
        return (
          <Normal
            credential={credential as VerifiableCredential}
            title={{
              subject: t('subject'),
              issuer: t('issuer'),
              dates: t('dates'),
            }}
            viewJsonText={t('view-json')}
            selectJsonData={selectJsonData}
          />
        );
    }
  }, [credential, template]);

  return (
    <>
      <div className="flex flex-col space-y-8">
        <div className="items-cetner flex flex-col-reverse px-6 pt-6 sm:flex-row">
          <div className="w-full sm:w-11/12">
            <h2 className="dark:text-navy-blue-200 font-bold text-gray-800">
              {t('title')}
            </h2>
            <Tooltip
              content={types}
              className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
            >
              <h1 className="font-ubuntu dark:text-orange-accent-dark text-left text-lg font-medium text-pink-500 sm:text-xl md:text-2xl lg:truncate">
                {getFirstWord(types)}
              </h1>
            </Tooltip>
          </div>
          <div className="flex w-full flex-1 justify-end space-x-1">
            <Tooltip
              className="border-navy-blue-300 bg-navy-blue-100 text-navy-blue-700"
              content={
                isValid ? t('credential-valid') : t('credential-invalid')
              }
            >
              {isValid ? (
                <CheckCircleIcon className="dark:text-orange-accent-dark h-12 w-12 text-pink-500" />
              ) : (
                <ExclamationCircleIcon className="dark:text-orange-accent-dark h-12 w-12 text-pink-500" />
              )}
            </Tooltip>
            <div className="flex flex-col items-end">
              <h1 className="font-ubuntu dark:text-orange-accent-dark text-left text-lg font-medium text-pink-500 sm:text-xl md:text-2xl lg:truncate">
                {t('status')}
              </h1>
              <h2 className="dark:text-navy-blue-200 font-bold text-gray-800">
                {isValid ? 'Valid' : 'Invalid'}
              </h2>
            </div>
          </div>
        </div>
        {renderTemplate}
        <div
          className="text-md dark:text-navy-blue-200 cursor-pointer px-6 font-medium text-gray-700"
          onClick={() => {
            const params = new URLSearchParams(window.location.search);
            params.set('view', 'Json');
            router.replace(`${pathname}?${params.toString()}`);
          }}
        >
          {t('view-json')}
        </div>
      </div>
      <JsonModal
        isOpen={jsonModalOpen}
        setOpen={setJsonModalOpen}
        data={selectedJsonData}
      />
    </>
  );
};

export default CredentialPanel;
