'use client';

import { shallow } from 'zustand/shallow';

import AddressPopover from '@/components//AddressPopover';
import ConnectButton from '@/components//ConnectButton';
import DropdownMenu from '@/components//DropdownMenu';
import MethodDropdownMenu from '@/components/MethodDropdownMenu';
import { NETWORKS } from '@/utils/constants';
import { useGeneralStore, useMascaStore } from '@/stores';

export const NavConnection = () => {
  const { did, currMethod, changeVcs } = useMascaStore(
    (state) => ({
      did: state.currDID,
      currMethod: state.currDIDMethod,
      changeVcs: state.changeVcs,
    }),
    shallow
  );

  const {
    isConnected,
    hasMM,
    hasFlask,
    address,
    chainId,
    changeChainId,
    changeIsConnected,
    changeAddres,
    changeDid,
  } = useGeneralStore(
    (state) => ({
      isConnected: state.isConnected,
      hasMM: state.hasMetaMask,
      hasFlask: state.isFlask,
      address: state.address,
      chainId: state.chainId,
      changeIsConnected: state.changeIsConnected,
      changeAddres: state.changeAddress,
      changeDid: state.changeDid,
      changeChainId: state.changeChainId,
    }),
    shallow
  );

  const getNetwork = (): string => {
    if (NETWORKS[chainId]) return NETWORKS[chainId];
    return 'Switch chain';
  };

  const setNetwork = async (network: string) => {
    const key = Object.keys(NETWORKS).find((val) => NETWORKS[val] === network);
    if (window.ethereum && key) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: key }],
        });
      } catch (switchError) {
        console.error(switchError);
      }
    }
  };

  const disconnect = () => {
    changeVcs([]);
    changeIsConnected(false);
    changeAddres('');
    changeDid('');
  };

  console.log('hasMM: ', hasMM);
  console.log('hasFlask: ', hasFlask);

  if (!hasMM || !hasFlask) return null;

  if (isConnected) {
    return (
      <div className="flex items-center justify-center">
        {(currMethod === 'did:ethr' || currMethod === 'did:pkh') && (
          <DropdownMenu
            size="method"
            rounded="full"
            shadow="none"
            variant="method"
            items={Object.values(NETWORKS)}
            selected={getNetwork()}
            setSelected={setNetwork}
          />
        )}
        <MethodDropdownMenu />
        <AddressPopover address={address} did={did} disconnect={disconnect} />
      </div>
    );
  }

  return (
    <div className="m-auto flex">
      <ConnectButton />
    </div>
  );
};
