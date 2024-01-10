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

  const verifyToken = async (token: string) => {
    const response = await fetch('/api/supabase/verify', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 204) {
      Cookies.remove('token');
      changeToken('');
      changeIsSignedIn(false);
    }

    changeToken(token);
    changeIsSignedIn(true);
  };

  useEffect(() => {
    if (isSignedIn) return;

    const token = Cookies.get('token');
    if (!token) return;

    verifyToken(token).catch((error) => {
      Cookies.remove('token');
      console.error(error);
    });
  }, []);

  return null;
};
