import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { isError } from '@blockchain-lab-um/masca-connector';
import { useTranslations } from 'next-intl';
import { shallow } from 'zustand/shallow';

import { useMascaStore, useToastStore, useAuthStore } from '@/stores';
import type { CompletedRequirements } from '.';
import Button from '../Button';
import { Requirement } from './Requirement';

interface RequirementProps {
  id: string;
  title: string;
  action: string;
  issuer: string;
  types: string[];
  verify: () => Promise<boolean>;
}

interface CampaignProps {
  id: string;
  title: string;
  description: string;
  claimed: number;
  total: number;
  imageUrl: string;
  requirements: RequirementProps[];
  completedRequirements: CompletedRequirements;
}

export const Campaign = (props: CampaignProps) => {
  const {
    id,
    title,
    description,
    claimed,
    total,
    imageUrl,
    requirements,
    completedRequirements,
  } = props;
  const t = useTranslations('CampaignDisplay');
  const { token, isSignedIn, changeIsSignInModalOpen } = useAuthStore(
    (state) => ({
      token: state.token,
      isSignedIn: state.isSignedIn,
      changeIsSignInModalOpen: state.changeIsSignInModalOpen,
    }),
    shallow
  );
  const { api, didMethod, did, changeDID, changeCurrDIDMethod } = useMascaStore(
    (state) => ({
      api: state.mascaApi,
      didMethod: state.currDIDMethod,
      did: state.currDID,
      changeDID: state.changeCurrDID,
      changeCurrDIDMethod: state.changeCurrDIDMethod,
    }),
    shallow
  );
  const [claiming, setClaiming] = useState(false);

  const completedIds = useMemo(
    () => completedRequirements.map((completed) => completed.id),
    [completedRequirements]
  );

  const disabled = useMemo(
    () =>
      !requirements.every((requirement) =>
        completedIds.includes(requirement.id)
      ),
    [requirements, completedIds]
  );

  const claimedString = useMemo(() => `${claimed}/${total}`, [claimed, total]);

  const handleClaim = async () => {
    try {
      setClaiming(true);
      if (!isSignedIn || !token) {
        changeIsSignInModalOpen(true);
        setClaiming(false);
        return;
      }
      if (didMethod !== 'did:pkh') {
        const changeMethod = await api?.switchDIDMethod('did:pkh');
        if (!changeMethod || isError(changeMethod)) {
          console.error('error switching did method');
          throw new Error(changeMethod?.error);
        }
        changeCurrDIDMethod('did:pkh');
        changeDID(changeMethod.data);
      }
      if (!did) throw new Error('No DID');

      // TODO - call issue endpoint and show error or save returned vc to snap
      const response = await fetch('/api/campaigns/issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${useAuthStore.getState().token}`,
        },
        body: JSON.stringify({ campaignId: id, did }),
      });

      if (!response.ok) {
        console.error('error claiming campaign');
        throw new Error(response.statusText);
      }

      const json = await response.json();

      const saved = await api?.saveCredential(json.credential);
      if (!saved || isError(saved)) {
        throw new Error(saved?.error);
      }
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('claim-success'),
          type: 'success',
          loading: false,
          link: null,
        });
      }, 200);
      setClaiming(false);
    } catch (error) {
      setClaiming(false);
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: `${t('claim-error')}: ${(error as Error).message}`,
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
    }
  };

  return (
    <div className="dark:bg-navy-blue-800 dark:text-navy-blue-400 flex rounded-3xl bg-white shadow-md">
      <div className="dark:border-navy-blue-700 hidden w-1/4 items-center justify-center border-r-4 border-gray-100 md:flex">
        <div className="dark:ring-navy-blue-700 relative h-[96px] w-[96px] overflow-hidden  rounded-full ring-4 ring-gray-200 lg:h-[128px] lg:w-[128px]">
          <Image src={imageUrl} fill={true} alt="campaign" />
        </div>
      </div>

      <div className="w-full px-8 py-4">
        <div className="w-full">
          <h2 className="font-ubuntu dark:text-navy-blue-50 text-2xl font-medium leading-6 text-gray-800">
            {title}
          </h2>
          <p className="text-md dark:text-navy-blue-400 mt-4 text-gray-600">
            {description}
          </p>
          {requirements.length > 0 && (
            <h5 className="font-ubuntu dark:text-navy-blue-200 mt-8 text-lg font-medium leading-6 text-gray-700">
              {t('requirements')}
            </h5>
          )}
        </div>
        <div className="mt-2 w-full">
          {requirements.map((requirement: RequirementProps) => {
            if (!requirement) return null;
            return (
              <Requirement
                key={requirement.id}
                id={requirement.id}
                title={requirement.title}
                action={requirement.action}
                issuer={requirement.issuer}
                types={requirement.types}
                verify={requirement.verify}
                completed={completedIds.includes(requirement.id)}
              />
            );
          })}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm">
            {claimedString} {t('claimed')}
          </p>
          <Button
            variant="primary"
            size="sm"
            disabled={disabled || claiming}
            onClick={handleClaim}
            loading={claiming}
          >
            {t('claim')}
          </Button>
        </div>
      </div>
    </div>
  );
};
