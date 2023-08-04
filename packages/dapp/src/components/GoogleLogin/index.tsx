'use client';

import { useGoogleLogin } from '@react-oauth/google';

import Button from '../Button';

const GoogleButton = () => {
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log(codeResponse);
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
