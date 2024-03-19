import React, { useMemo } from 'react';
import Image from 'next/image';
import { isError } from '@blockchain-lab-um/masca-connector';
import { useTranslations } from 'next-intl';
import { shallow } from 'zustand/shallow';

import { useMascaStore, useToastStore, useAuthStore } from '@/stores';
import Button from '../Button';
import { RequirementDisplay } from './RequirementDisplay';
import { Campaigns, useClaimCampaign, useCompletedRequirements } from '@/hooks';
import { useAccount, useSwitchChain } from 'wagmi';

type CampaignProps = {
  campaign: Campaigns[number];
};

export const CampaignDisplay = ({
  campaign: {
    id,
    title,
    description,
    claimed,
    total,
    image_url: imageUrl,
    requirements,
  },
}: CampaignProps) => {
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

  const { switchChainAsync } = useSwitchChain();
  const { chainId, address } = useAccount();

  const { mutate: claimCampaign, isPending: isClaiming } = useClaimCampaign(
    id,
    token
  );

  const { data: completedRequirementsData } = useCompletedRequirements(token);

  const completedRequirements = useMemo(
    () =>
      completedRequirementsData
        ? completedRequirementsData.completedRequirements
        : [],
    [completedRequirementsData]
  );

  const claimedString = useMemo(
    () =>
      total === null
        ? `${claimed} ${t('claimed')}`
        : `${claimed}/${total} ${t('claimed')}`,
    [claimed, total]
  );

  const handleClaim = async () => {
    if (!api) return;

    // We only support mainnet for now
    if (chainId !== 1) {
      try {
        await switchChainAsync({ chainId: 1 });
      } catch (error) {
        setTimeout(() => {
          useToastStore.setState({
            open: true,
            title: 'Failed to switch to mainnet',
            type: 'error',
            loading: false,
            link: null,
          });
        }, 200);
        return;
      }
    }

    // We only support did:pkh for now
    if (didMethod !== 'did:pkh') {
      const changeMethodResult = await api.switchDIDMethod('did:pkh');
      if (isError(changeMethodResult)) {
        useToastStore.setState({
          open: true,
          title: "Failed to change DID method to 'did:pkh'",
          type: 'error',
          loading: false,
          link: null,
        });
        return;
      }
      changeCurrDIDMethod('did:pkh');
      changeDID(changeMethodResult.data);
    }

    claimCampaign({ did });
  };

  return (
    <div className="dark:bg-navy-blue-800 dark:text-navy-blue-400 flex rounded-3xl bg-white shadow-md">
      <div className="dark:border-navy-blue-700 hidden w-1/4 items-center justify-center border-r-4 border-gray-100 md:flex">
        <div className="dark:ring-navy-blue-700 relative h-[96px] w-[96px] overflow-hidden rounded-full ring-4 ring-gray-200 lg:h-[128px] lg:w-[128px]">
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
          {requirements.map((requirement) => (
            <RequirementDisplay
              key={requirement.id}
              requirement={requirement}
              completed={completedRequirements.includes(requirement.id)}
            />
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm">{claimedString}</p>
          <Button
            variant="primary"
            size="sm"
            disabled={!did || isClaiming || claimed === total || !address}
            onClick={() =>
              isSignedIn ? handleClaim() : changeIsSignInModalOpen(true)
            }
            loading={isClaiming}
          >
            {t('claim')}
          </Button>
        </div>
      </div>
    </div>
  );
};
