'use client';

import { useAccount, useChainId, useDisconnect, useSwitchChain } from 'wagmi';

import AddressPopover from '@/components//AddressPopover';
import ConnectButton from '@/components//ConnectButton';
import DropdownMenu from '@/components//DropdownMenu';
import MethodDropdownMenu from '@/components/MethodDropdownMenu';
import { getAvailableNetworksList, NETWORKS } from '@/utils/networks';
import { useGeneralStore, useMascaStore } from '@/stores';

export const NavConnection = () => {
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();
  const { did, currMethod, changeVcs } = useMascaStore((state) => ({
    did: state.currDID,
    currMethod: state.currDIDMethod,
    changeVcs: state.changeVcs,
  }));

  const { changeDid, provider } = useGeneralStore((state) => ({
    provider: state.provider,
    changeDid: state.changeDid,
    changeProvider: state.changeProvider,
  }));

  const getNetwork = (): string => {
    if (NETWORKS[`0x${chainId.toString(16)}`]) return NETWORKS[chainId];
    return 'Switch chain';
  };

  const setNetwork = async (network: string) => {
    const key = Object.keys(NETWORKS).find((val) => NETWORKS[val] === network);
    if (key) {
      console.log('setting net');
      // try {
      //   await provider.request({
      //     method: 'wallet_switchEthereumChain',
      //     params: [{ chainId: key }],
      //   });
      // } catch (switchError) {
      //   if (
      //     (switchError as { code?: number; message: string; stack: string })
      //       .code === 4902
      //   ) {
      //     await provider.request({
      //       method: 'wallet_addEthereumChain',
      //       params: [chainIdNetworkParamsMapping[key]],
      //     });
      //   }
      //   console.error(switchError);
      // }
      switchChain({ chainId: Number(key) });
    }
  };

  const disconnectHandler = () => {
    changeVcs([]);
    disconnect();
    changeDid('');
  };

  if (isConnected) {
    return (
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
    );
  }

  return <ConnectButton />;
};
