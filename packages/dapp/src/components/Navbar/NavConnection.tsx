import { shallow } from 'zustand/shallow';

import MethodDropdownMenu from '@/components/MethodDropdownMenu';
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

  const networks: Record<string, string> = {
    '0x1': 'Ethereum',
    '0x5': 'Goerli Testnet',
  };

  const getNetwork = (): string => {
    if (networks[chainId]) return networks[chainId];
    return 'Switch chain';
  };

  // eslint-disable-next-line @typescript-eslint/require-await
  const setNetwork = async (newNetwork: string) => {
    const key = Object.keys(networks).find(
      (val) => networks[val] === newNetwork
    );
    if (window.ethereum) {
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
            items={Object.values(networks)}
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
