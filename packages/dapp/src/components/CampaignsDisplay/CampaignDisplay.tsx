import React, { useMemo } from 'react';
import Image from 'next/image';
import { isError } from '@blockchain-lab-um/masca-connector';
import { useTranslations } from 'next-intl';
import { shallow } from 'zustand/shallow';

import { useMascaStore, useToastStore, useAuthStore } from '@/stores';
import Button from '../Button';
import { RequirementDisplay } from './RequirementDisplay';
import {
  type Campaigns,
  useClaimCampaign,
  useCompletedRequirements,
  useSwitchChain,
} from '@/hooks';
import { useAccount } from 'wagmi';
import { RewardDisplay } from './RewardDisplay';

type CampaignProps = {
  campaign: Campaigns[number];
  alreadyClaimed: boolean;
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
    rewards,
  },
  alreadyClaimed,
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

  const { switchChain } = useSwitchChain();
  const { address } = useAccount();

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
    if (!(await switchChain(1))) return;

    let currentDid = did;

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
      currentDid = changeMethodResult.data;
    }

    claimCampaign({ did: currentDid });
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
          <h5 className="font-ubuntu dark:text-navy-blue-200 mt-8 text-lg font-medium leading-6 text-gray-700">
            {t('rewards')}
          </h5>
          <div className="mt-2 w-full">
            <RewardDisplay reward={rewards!} />
          </div>
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
            disabled={
              !did ||
              isClaiming ||
              (!alreadyClaimed && claimed === total) ||
              !address ||
              !requirements.every((reqToCheck) =>
                completedRequirements.some(
                  (completedReq) => completedReq === reqToCheck.id
                )
              )
            }
            onClick={() => {
              if (isSignedIn) {
                handleClaim();
              } else {
                changeIsSignInModalOpen(true);
              }
            }}
            loading={isClaiming}
          >
            {alreadyClaimed ? t('reclaim') : t('claim')}
          </Button>
        </div>
      </div>
    </div>
  );
};
