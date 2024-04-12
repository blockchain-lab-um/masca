'use client';

import { requiresNetwork } from '@blockchain-lab-um/masca-connector';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useAccount, useChainId, useDisconnect, useSwitchChain } from 'wagmi';

import AddressPopover from '@/components/AddressPopover';
import ConnectButton from '@/components/ConnectButton';

import MethodDropdownMenu from '@/components/MethodDropdownMenu';
import { useMascaStore } from '@/stores';
import {
  NETWORKS,
  NETWORKS_BY_DID,
  getAvailableNetworksList,
} from '@/utils/networks';
import { Network } from 'ethers';
import NetworkDropDownMenu from '@/components/NetworkDropDownMenu';

export const NavConnection = () => {
  const { switchChain } = useSwitchChain();
  const t = useTranslations('NavConnection');
  const chainId = useChainId();
  const [selectedNetwork, changeSelectedNetwork] = useState<string>('Ethereum');
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();
  const { did, currMethod, changeVcs, changeDid } = useMascaStore((state) => ({
    did: state.currDID,
    currMethod: state.currDIDMethod,
    changeVcs: state.changeVcs,
    changeDid: state.changeCurrDID,
  }));

  const getNetwork = (): string => {
    if (!currMethod) return t('select-method');
    const stringified = `0x${chainId.toString(16)}`;
    const network = NETWORKS[stringified];
    if (
      network &&
      (NETWORKS_BY_DID[currMethod].includes(stringified) ||
        NETWORKS_BY_DID[currMethod].includes('*'))
    ) {
      return network;
    }
    return t('unsupported-network');
  };

  useEffect(() => {
    if (!currMethod) return;
    if (
      currMethod !== 'did:polygonid' &&
      currMethod !== 'did:iden3' &&
      !requiresNetwork(currMethod)
    )
      return;
    const network = getNetwork();
    changeSelectedNetwork(network);
  }, [chainId, currMethod]);

  const setNetwork = async (network: string) => {
    const key = Object.keys(NETWORKS).find((val) => NETWORKS[val] === network);
    if (key) {
      switchChain(
        { chainId: Number(key) },
        { onError: (err) => console.log(err) }
      );
    }
  };

  const disconnectHandler = () => {
    changeVcs([]);
    disconnect();
    changeDid('');
  };

  return isConnected ? (
    <div className="flex items-center justify-center">
      {(currMethod === 'did:ethr' ||
        currMethod === 'did:pkh' ||
        currMethod === 'did:polygonid' ||
        currMethod === 'did:ens' ||
        currMethod === 'did:iden3') && (
        <div className="hidden md:block">
          <NetworkDropDownMenu
            size="method"
            rounded="full"
            shadow="none"
            variant="method"
            items={getAvailableNetworksList(currMethod)}
            selected={
              selectedNetwork === 'Goerli'
                ? t('unsupported-method')
                : selectedNetwork
            }
            setSelected={setNetwork}
          />
        </div>
      )}
      <MethodDropdownMenu />
      <AddressPopover did={did} disconnect={disconnectHandler} />
    </div>
  ) : (
    <ConnectButton />
  );
};
