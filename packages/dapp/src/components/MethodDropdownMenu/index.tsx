'use client';

import {
  type AvailableMethods,
  isError,
  requiresNetwork,
} from '@blockchain-lab-um/masca-connector';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useChainId, useSwitchChain } from 'wagmi';

import { useMascaStore, useToastStore } from '@/stores';
import { NETWORKS_BY_DID } from '@/utils/networks';
import { TextSkeleton } from '../Skeletons/TextSkeleton';
import { DropdownButton } from './MethodDropdownButton';

export default function MethodDropdownMenu() {
  const t = useTranslations('MethodDropdownMenu');
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { api, currMethod, methods, changeCurrDIDMethod, changeDID } =
    useMascaStore((state) => ({
      api: state.mascaApi,
      currMethod: state.currDIDMethod,
      methods: state.availableMethods,
      changeCurrDIDMethod: state.changeCurrDIDMethod,
      changeDID: state.changeCurrDID,
    }));

  const handleMethodChangeRequest = async (method: string) => {
    if (method !== currMethod) {
      if (!api) return;

      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('switching'),
          type: 'normal',
          loading: true,
          link: null,
        });
      }, 200);
      if (requiresNetwork(method)) {
        const availableNetworks = NETWORKS_BY_DID[method];
        const hasCorrectNetwork =
          availableNetworks.includes(`0x${chainId.toString(16)}`) ||
          availableNetworks.includes('*');
        let netToChange = availableNetworks[0];
        if (netToChange === '*') {
          netToChange = '0x1';
        }
        if (!hasCorrectNetwork) {
          await switchChainAsync({
            chainId: Number(netToChange),
          });
        }
      }

      const res = await api.switchDIDMethod(method as AvailableMethods);
      useToastStore.setState({
        open: false,
      });

      if (isError(res)) {
        console.log(res.error);
        setTimeout(() => {
          useToastStore.setState({
            open: true,
            title: t('switching-error'),
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
          title: `${t('switching-success')} ${
            method === 'did:key:jwk_jcs-pub' ? 'did:key (EBSI)' : method
          }`,
          type: 'success',
          loading: false,
          link: null,
        });
      }, 200);

      changeCurrDIDMethod(method);
      changeDID(res.data);
    }
  };

  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu onOpenChange={() => setOpen(!open)}>
      <DropdownMenuTrigger
        className={clsx(
          'dark:text-navy-blue-400 text-h5 font-ubuntu animated-transition inline-flex justify-center items-center rounded-3xl px-4 py-2 font-thin text-gray-600 outline-none focus:outline-none focus-visible:outline-none',
          open
            ? 'dark:bg-navy-blue-800 bg-orange-100/50'
            : 'dark:hover:bg-navy-blue-800 hover:bg-white/50'
        )}
        disabled={currMethod === null}
      >
        {currMethod ? (
          currMethod === 'did:key:jwk_jcs-pub' ? (
            'did:key (EBSI)'
          ) : (
            currMethod
          )
        ) : (
          <TextSkeleton className="h-4 w-16" />
        )}
        {currMethod && (
          <ChevronDownIcon
            className={clsx(
              'dark:text-navy-blue-400 animated-transition ml-1 h-5 w-5 text-gray-600',
              open ? 'rotate-180' : ''
            )}
          />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="dark:bg-navy-blue-600 z-50 mt-1 w-48 rounded-3xl bg-white shadow-lg border-none">
        <div className="p-1 text-center ">
          {methods.map((method) => (
            <DropdownButton
              key={method}
              selected={method === currMethod}
              handleBtn={handleMethodChangeRequest}
            >
              {method}
            </DropdownButton>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
