'use client';

import { useTranslations } from 'next-intl';

import { useAuthStore } from '@/stores/authStore';

export const SupabaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const t = useTranslations('SupabaseProvider');

  const { isSignedIn, token, changeIsSignInModalOpen } = useAuthStore(
    (state) => ({
      isSignedIn: state.isSignedIn,
      token: state.token,
      changeIsSignInModalOpen: state.changeIsSignInModalOpen,
    })
  );

  if (!isSignedIn) {
    return (
      <div className="dark:bg-navy-blue-800 dark:text-navy-blue-400 flex min-h-[50vh] w-full items-center justify-center rounded-3xl bg-white shadow-lg">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="dark:text-navy-blue-50 text-2xl font-medium text-gray-800">
            {t('sign-in-to-continue')}
          </h1>
          <button
            className="text-md rounded-xl bg-pink-500 px-4 py-2 font-medium text-white hover:bg-pink-600"
            onClick={() => changeIsSignInModalOpen(true)}
          >
            {t('sign-in')}
          </button>
        </div>
      </div>
    );
  }

  return children;
};
