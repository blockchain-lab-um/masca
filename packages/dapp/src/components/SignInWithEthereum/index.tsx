'use client';

import { BrowserProvider } from 'ethers';
import { SiweMessage } from 'siwe';

import Button from '@/components/Button';
import { useAuthStore } from '@/stores/authStore';

export const SignInWithEthereum = () => {
  const { changeToken, changeIsSignedIn } = useAuthStore((state) => ({
    changeToken: state.changeToken,
    changeIsSignedIn: state.changeIsSignedIn,
  }));

  const getNonce = async () => {
    const response = await fetch('/api/siwe/nonce', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to get nonce.');

    const data = await response.json();

    if (!data.nonce) throw new Error('Failed to get nonce.');

    return data as {
      nonce: string;
      expiresAt: string;
      createdAt: string;
    };
  };

  const createSiweMessage = async (address: string) => {
    const { nonce } = await getNonce();
    console.log(address);
    console.log(nonce);
    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement: 'Sign in with Ethereum to masca.io',
      uri: window.location.origin,
      version: '1',
      chainId: 1,
      nonce: nonce.replaceAll('-', ''),
    });

    return message.prepareMessage();
  };

  const handleSignInWithEthereum = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);

      const signer = await provider.getSigner();

      const message = await createSiweMessage(await signer.getAddress());

      const signature = await signer.signMessage(message);

      const response = await fetch('/api/siwe/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature }),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to sign in.');

      const data = await response.json();

      if (!data.jwt) throw new Error('Failed to sign in.');

      changeToken(data.jwt);
      changeIsSignedIn(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button variant="primary" size="lg" onClick={handleSignInWithEthereum}>
      Sign In With Ethereum
    </Button>
  );
};
