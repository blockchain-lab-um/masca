import { shallow } from 'zustand/shallow';

import MethodDropdownMenu from '@/components/MethodDropdownMenu';
import { useGeneralStore, useMascaStore } from '@/stores';
import AddressPopover from '../AddressPopover';
import ConnectButton from '../ConnectButton';

export const NavConnection = () => {
  const { did, changeVcs } = useMascaStore(
    (state) => ({ did: state.currDID, changeVcs: state.changeVcs }),
    shallow
  );

  const {
    isConnected,
    hasMM,
    hasFlask,
    address,
    changeIsConnected,
    changeAddres,
    changeDid,
  } = useGeneralStore(
    (state) => ({
      isConnected: state.isConnected,
      hasMM: state.hasMetaMask,
      hasFlask: state.isFlask,
      address: state.address,
      changeIsConnected: state.changeIsConnected,
      changeAddres: state.changeAddress,
      changeDid: state.changeDid,
    }),
    shallow
  );

  const disconnect = () => {
    changeVcs([]);
    changeIsConnected(false);
    changeAddres('');
    changeDid('');
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
