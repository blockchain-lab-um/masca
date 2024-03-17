'use client';

import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

import { useAuthStore } from '@/stores/authStore';
import { verifyToken } from '@/utils/verifyToken';

export const CookiesProvider = ({
  children,
}: { children: React.ReactNode }) => {
  const { changeToken, changeIsSignedIn } = useAuthStore((state) => ({
    changeToken: state.changeToken,
    changeIsSignedIn: state.changeIsSignedIn,
  }));

  const { address } = useAccount();

  useEffect(() => {
    // Return if user is not connected
    if (!address) {
      changeToken('');
      changeIsSignedIn(false);
      return;
    }

    const token = Cookies.get(`token-${address}`);
    if (!token) {
      changeToken('');
      changeIsSignedIn(false);
      return;
    }

    verifyToken(token)
      .then((isVerified) => {
        if (!isVerified) {
          Cookies.remove(`token-${address}`);
          changeToken('');
          changeIsSignedIn(false);
          return;
        }

        changeToken(token);
        changeIsSignedIn(true);
      })
      .catch((error) => {
        Cookies.remove(`token-${address}`);
        console.error(error);
      });
  }, [address]);

  return children;
};
