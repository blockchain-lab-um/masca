import { shallow } from 'zustand/shallow';

import MethodDropdownMenu from '@/components/MethodDropdownMenu';
import { useGeneralStore, useSnapStore } from '@/utils/stores';
import AddressPopover from '../AddressPopover';
import ConnectButton from '../ConnectButton';

export const NavConnection = () => {
  const did = useSnapStore((state) => state.currDID);

  const { isConnected, hasMM, hasFlask, address, changeIsConnected } =
    useGeneralStore(
      (state) => ({
        isConnected: state.isConnected,
        hasMM: state.hasMetaMask,
        hasFlask: state.isFlask,
        address: state.address,
        changeIsConnected: state.changeIsConnected,
      }),
      shallow
    );

  const setVcs = useSnapStore((state) => state.changeVcs);

  const disconnect = () => {
    setVcs([]);
    changeIsConnected(false);
  };

  if (!hasMM || !hasFlask) return null;

  if (isConnected) {
    return (
      <div className="flex items-center justify-center">
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
