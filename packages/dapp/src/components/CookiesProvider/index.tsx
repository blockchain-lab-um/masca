'use client';

import { useEffect } from 'react';
import Cookies from 'js-cookie';

import { useAuthStore } from '@/stores/authStore';

export const CookiesProvider = () => {
  const { isSignedIn, changeToken, changeIsSignedIn } = useAuthStore(
    (state) => ({
      isSignedIn: state.isSignedIn,
      changeToken: state.changeToken,
      changeIsSignedIn: state.changeIsSignedIn,
    })
  );

  useEffect(() => {
    if (isSignedIn) return;

    const token = Cookies.get('token');
    if (!token) return;

    // TODO: Verify if token is valid
    changeToken(token);
    changeIsSignedIn(true);
  }, []);

  return null;
};
