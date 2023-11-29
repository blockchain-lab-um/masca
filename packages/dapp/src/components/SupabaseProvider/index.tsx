'use client';

import { useAuthStore } from '@/stores/authStore';
import { SignInWithEthereum } from '../SignInWithEthereum';

export const SupabaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isSignedIn = useAuthStore((state) => state.isSignedIn);

  if (!isSignedIn) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <SignInWithEthereum />
      </div>
    );
  }

  return children;
};
