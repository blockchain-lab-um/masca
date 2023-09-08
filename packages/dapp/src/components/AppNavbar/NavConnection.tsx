'use client';

import { chainIdNetworkParamsMapping } from '@blockchain-lab-um/masca-connector';

import AddressPopover from '@/components//AddressPopover';
import ConnectButton from '@/components//ConnectButton';
import DropdownMenu from '@/components//DropdownMenu';
import MethodDropdownMenu from '@/components/MethodDropdownMenu';
import { getAvailableNetworksList, NETWORKS } from '@/utils/networks';
import { useGeneralStore, useMascaStore } from '@/stores';

export const NavConnection = () => {
  const { did, currMethod, changeVcs } = useMascaStore((state) => ({
    did: state.currDID,
    currMethod: state.currDIDMethod,
    changeVcs: state.changeVcs,
  }));

  const {
    isConnected,
    hasMM,
    address,
    chainId,
    changeIsConnected,
    changeAddres,
    changeDid,
  } = useGeneralStore((state) => ({
    isConnected: state.isConnected,
    hasMM: state.hasMetaMask,
    address: state.address,
    chainId: state.chainId,
    changeIsConnected: state.changeIsConnected,
    changeAddres: state.changeAddress,
    changeDid: state.changeDid,
  }));

  const getNetwork = (): string => {
    if (NETWORKS[chainId]) return NETWORKS[chainId];
    return 'Switch chain';
  };

  const setNetwork = async (network: string) => {
    const key = Object.keys(NETWORKS).find((val) => NETWORKS[val] === network);
    if (window.ethereum && key) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: key }],
        });
      } catch (switchError) {
        if (
          (switchError as { code?: number; message: string; stack: string })
            .code === 4902
        ) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [chainIdNetworkParamsMapping[key]],
          });
        }
        console.error(switchError);
      }
    }
  };

  const disconnect = () => {
    changeVcs([]);
    changeIsConnected(false);
    changeAddres('');
    changeDid('');
    localStorage.setItem('isConnected', 'false');
  };

  if (!hasMM) return null;

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
        <AddressPopover address={address} did={did} disconnect={disconnect} />
      </div>
    );
  }

  return <ConnectButton />;
};
