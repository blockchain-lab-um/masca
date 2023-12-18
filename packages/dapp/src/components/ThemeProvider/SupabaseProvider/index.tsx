'use client';

import { useAuthStore } from '@/stores/authStore';

// import { SignInWithEthereum } from '@/components/SignInWithEthereum';

export const SupabaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isSignedIn = useAuthStore((state) => state.isSignedIn);

  if (!isSignedIn) {
    return (
      <div className="dark:bg-navy-blue-800 dark:text-navy-blue-400 flex min-h-[50vh] w-full items-center justify-center rounded-3xl bg-white shadow-lg">
        {/* <SignInWithEthereum /> */}
      </div>
    );
  }

  return children;
};
