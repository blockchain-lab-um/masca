'use client';

import { useAuthStore } from '@/stores/authStore';
import { SignInWithEthereum } from '../SignInWithEthereum';

export const SupabaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isSignedIn = useAuthStore((state) => state.isSignedIn);

  if (!isSignedIn)
    return (
      <div className="flex justify-center py-12">
        <SignInWithEthereum />
      </div>
    );

  return children;
};
