'use client';

import { SignInWithEthereum } from '@/components/SignInWithEthereum';
import { useAuthStore } from '@/stores/authStore';

export const SupabaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isSignedIn = useAuthStore((state) => state.isSignedIn);

  if (!isSignedIn) {
    return (
      <div className="dark:bg-navy-blue-800 dark:text-navy-blue-400 flex min-h-[50vh] w-full items-center justify-center rounded-3xl bg-white shadow-lg">
        <SignInWithEthereum />
      </div>
    );
  }

  return children;
};
