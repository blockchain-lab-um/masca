'use client';

import { isError } from '@blockchain-lab-um/masca-connector';
import { useGoogleLogin } from '@react-oauth/google';

import { useMascaStore } from '@/stores';
import Button from '../Button';

const GoogleButton = () => {
  const api = useMascaStore((state) => state.mascaApi);
  const changeIsSignedInGoogle = useMascaStore(
    (state) => state.changeIsSignedInGoogle
  );
  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      console.log(
        '🚀 ~ file: index.tsx:10 ~ GoogleButton ~ codeResponse:',
        codeResponse
      );
      if (!api) return;
      const res = await api.setGoogleToken(codeResponse.access_token);

      if (isError(res)) {
        return;
      }
      changeIsSignedInGoogle(res.data);
    },
    onError: (error) => console.log(error),
    scope:
      'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata',
  });
  return (
    <div>
      <Button variant="primary" size="sm" onClick={login}>
        Sign in with Google
      </Button>
    </div>
  );
};

export default GoogleButton;
