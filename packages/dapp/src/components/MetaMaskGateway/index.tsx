import React, { useEffect } from 'react';
import { shallow } from 'zustand/shallow';

import { useGeneralStore } from '@/utils/stores';

type MetaMaskGatewayProps = {
  children: React.ReactNode;
};

const MetaMaskGateway = ({ children }: MetaMaskGatewayProps) => {
  const { changeHasMetaMask, changeIsFlask, hasMM, hasFlask } = useGeneralStore(
    (state) => ({
      changeHasMetaMask: state.changeHasMetaMask,
      changeIsFlask: state.changeIsFlask,
      hasMM: state.hasMetaMask,
      hasFlask: state.isFlask,
    }),
    shallow
  );

  useEffect(() => {
    // const isSnapsSupported = async () => {
    //   const res = await isMetamaskSnapsSupported();
    //   changeIsFlask(res);
    // };
    // const mm = hasMetaMask();
    // changeHasMetaMask(mm);
    // isSnapsSupported()
    //   .then(() => {})
    //   .catch(() => {});
  }, []);

  if (hasMM && hasFlask) {
    return <>{children}</>;
  }
  return (
    <div className="w-full min-h-full flex justify-center items-center">
      <h3 className="text-h3 text-gray-800">
        Install MetaMask Flask to use the dApp!
      </h3>
    </div>
  );
};

export default MetaMaskGateway;
