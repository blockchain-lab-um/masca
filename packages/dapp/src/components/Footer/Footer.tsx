import React from 'react';
import { useRouter } from 'next/router';
import Button from '../Button';
import DropdownMenu from '../MethodDropdownMenu';
import ToggleTheme from '../ToggleTheme';
import { useGeneralStore } from '../../utils/store';
import ConnectButton from '../ConnectButton';

export const Footer = () => {
  const router = useRouter();
  const isConnected = useGeneralStore((state) => state.isConnected);
  const changeIsConnected = useGeneralStore((state) => state.changeIsConnected);
  const hasMM = useGeneralStore((state) => state.hasMetaMask);
  const hasFlask = useGeneralStore((state) => state.isFlask);
  const address = useGeneralStore((state) => state.address);

  return (
    <div
      className={`${
        router.pathname === '/' ? 'hidden' : ''
      } flex justify-between items-center mt-auto px-5 py-2 bg-orange/10 md:hidden`}
    >
      {hasFlask && hasMM && (
        <>
          {isConnected && (
            <span>
              <div className="flex m-auto justify-center items-center">
                <Button
                  className="btn-primary"
                  onClick={() => {
                    changeIsConnected(false);
                  }}
                >
                  {`${address.slice(0, 6)}...${address.slice(-4)}`}
                </Button>
                <DropdownMenu />
              </div>
            </span>
          )}
          {!isConnected && <ConnectButton />}
        </>
      )}
      <ToggleTheme />
    </div>
  );
};

export default Footer;
