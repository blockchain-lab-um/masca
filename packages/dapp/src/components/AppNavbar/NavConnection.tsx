'use client';

import { useTranslations } from 'next-intl';
import { useAccount, useChainId, useDisconnect, useSwitchChain } from 'wagmi';

import AddressPopover from '@/components//AddressPopover';
import ConnectButton from '@/components//ConnectButton';
import DropdownMenu from '@/components//DropdownMenu';
import MethodDropdownMenu from '@/components/MethodDropdownMenu';
import {
  getAvailableNetworksList,
  NETWORKS,
  NETWORKS_BY_DID,
} from '@/utils/networks';
import { useGeneralStore, useMascaStore } from '@/stores';

export const NavConnection = () => {
  const { switchChain } = useSwitchChain();
  const t = useTranslations('NavConnection');
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();
  const { did, currMethod, changeVcs } = useMascaStore((state) => ({
    did: state.currDID,
    currMethod: state.currDIDMethod,
    changeVcs: state.changeVcs,
  }));

  const { changeDid } = useGeneralStore((state) => ({
    changeDid: state.changeDid,
  }));

  const getNetwork = (): string => {
    const stringified = `0x${chainId.toString(16)}`;
    const selectedNetwork = NETWORKS[stringified];
    if (!currMethod) return t('select-method');
    if (
      selectedNetwork &&
      (NETWORKS_BY_DID[currMethod].includes(stringified) ||
        NETWORKS_BY_DID[currMethod].includes('*'))
    ) {
      return selectedNetwork;
    }
    return t('unsupported-network');
  };

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
        currMethod === 'did:iden3') && (
        <div className="hidden md:block">
          <DropdownMenu
            size="method"
            rounded="full"
            shadow="none"
            variant="method"
            items={getAvailableNetworksList(currMethod)}
            selected={getNetwork()}
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
