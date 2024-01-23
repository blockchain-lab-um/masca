'use client';

import { Fragment } from 'react';
import {
  isError,
  requiresNetwork,
  type AvailableMethods,
} from '@blockchain-lab-um/masca-connector';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useChainId, useSwitchChain } from 'wagmi';

import { NETWORKS_BY_DID } from '@/utils/networks';
import { useMascaStore, useToastStore } from '@/stores';
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
          const { id } = await switchChainAsync({
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

  return (
    <Menu as="div" className="relative z-20 mx-2">
      {({ open }) => (
        <Fragment>
          <div>
            <Menu.Button
              className={clsx(
                'dark:text-navy-blue-400 text-h5 font-ubuntu animated-transition inline-flex w-full justify-center rounded-3xl px-4 py-2 font-thin text-gray-600 outline-none focus:outline-none focus-visible:outline-none',
                open
                  ? 'dark:bg-navy-blue-800 bg-orange-100/50'
                  : 'dark:hover:bg-navy-blue-800 hover:bg-orange-100/50'
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
                    'dark:text-navy-blue-400 animated-transition -mr-1 ml-2 h-5 w-5 text-gray-600',
                    open ? 'rotate-180' : ''
                  )}
                />
              )}
            </Menu.Button>
          </div>

          <Transition
            show={open}
            enter="transition ease-out duration-100"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            {currMethod && (
              <Menu.Items className="dark:bg-navy-blue-600 absolute right-0 z-50 mt-1 w-48 rounded-3xl bg-white shadow-lg">
                <div className="p-1 text-center ">
                  {methods.map((method, id) => (
                    <DropdownButton
                      key={id}
                      selected={method === currMethod}
                      handleBtn={handleMethodChangeRequest}
                    >
                      {method}
                    </DropdownButton>
                  ))}
                </div>
              </Menu.Items>
            )}
          </Transition>
        </Fragment>
      )}
    </Menu>
  );
}
