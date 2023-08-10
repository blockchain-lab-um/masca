'use client';

import { useGoogleLogin } from '@react-oauth/google';

import { useMascaStore } from '@/stores';
import Button from '../Button';

const GoogleButton = () => {
  const api = useMascaStore((state) => state.mascaApi);
  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      console.log(
        '🚀 ~ file: index.tsx:10 ~ GoogleButton ~ codeResponse:',
        codeResponse
      );
      if (!api) return;
      await api.setGoogleToken(codeResponse.access_token);
    },
    onError: (error) => console.log(error),
    scope:
      'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata',
  });
  return (
    <div>
      <Button variant="primary" onClick={login}>
        Sign in with Google
      </Button>
    </div>
  );
};

export default GoogleButton;
