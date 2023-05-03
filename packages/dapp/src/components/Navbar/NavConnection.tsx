import { shallow } from 'zustand/shallow';

import MethodDropdownMenu from '@/components/MethodDropdownMenu';
import { NETWORKS } from '@/utils/constants';
import { useGeneralStore, useMascaStore } from '@/stores';
import AddressPopover from '../AddressPopover';
import ConnectButton from '../ConnectButton';
import DropdownMenu from '../DropdownMenu';

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

  if (!hasMM || !hasFlask) return null;

  if (isConnected) {
    return (
      <div className="flex items-center justify-center">
        {(currMethod === 'did:ethr' || currMethod === 'did:pkh') && (
          <DropdownMenu
            size="sm"
            rounded="full"
            shadow="none"
            variant="primary-active"
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
